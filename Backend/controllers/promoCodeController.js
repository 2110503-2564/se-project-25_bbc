import Promocode from "../models/PromoCode.js";

export const createPromocode = async (req, res) => {
  try {
    req.body.hotel_id = req.user.hotel_id || req.body.hotel_id;
    const promoCode = await Promocode.create(req.body);
    return res.status(201).json({ success: true, promoCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchPromocodes = async (req, res) => {
  try {
    const { select, populate, limit, ...filters } = req.query;

    // Build the query with filters
    let query = Promocode.find(filters);

    // Handle selection
    if (select) {
        const fieldsToSelect = select.split(",").join(" ");
        query = query.select(fieldsToSelect);
    }

    // Handle populate
    if (populate) {
        const populateFields = populate.split(",");
        populateFields.forEach((field) => {
            let [popField, popSelect] = field.split(":");
            if (popSelect) query = query.populate({ path: popField, select: popSelect.split(";").join(" ") });
            else query = query.populate(popField);
        });
    }

    // Handle limit if provided
    if (limit) {
        query = query.limit(Number(limit));
    }

    // Execute the query
    const promoCodes = await query;
    return res.status(200).json({
      success: true,
      count: promos.length,
      promoCodes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkPromocode = async (req, res) => {
  try {
    const { code } = req.body;
    const account_id = req.user._id;

    const { status , ...result } = await checkingPromocode(code , account_id);

    return res.status(status).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const usePromocode = async (req, res) => {
  try {
    const account_id = req.body.account_id || req.user._id;
    const { code } = req.body;

    const { status , ...result } = await checkingPromocode(code , account_id);
    if(status !== 200) return res.status(status).json(result); 

    const promoCode = result.promoCode;
    promoCode.usage += 1;
    promoCode.usedBy.push(account_id);

    await promoCode.save();

    return res.status(200).json({
      success: true,
      promoCode,
      message: "Promocode applied successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePromocode = async (req, res) => {
  try {
    const promoCode = await Promocode.findByIdAndUpdate(
      req.params.promo_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      promoCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePromocode = async (req, res) => {
  try {
    const promoCode = await Promocode.findByIdAndDelete(req.params.promo_id);
    res.status(200).json({
      success: true,
      message: "Promocode deleted successfully",
      promoCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkingPromocode = async (code , account_id) => {
  try {

    // 1. Find the promocode
    const promoCode = await Promocode.findOne({ code });
    if (!promoCode) return { status: 404, success: false, message: "Promotion code not found." };

    // 2. Check if expired
    if (promoCode.expire < new Date()) {
      return { status: 400, success: false, message: "Promotion code has expired." };
    }

    // 3. Check if usage limit exceeded
    if (promoCode.limit !== null && promoCode.usage >= promoCode.limit) {
      return { status: 400, success: false, message: "Promotion code usage limit reached." };
    }

    // 4. Check if user already used it
    if (promoCode.usedBy.includes(account_id)) {
      return { status: 400, success: false, message: "You have already used this promotion code." };
    }

    return {
      status: 200,
      success: true,
      message: "Promotion code verified successfully",
      promoCode
    };

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
