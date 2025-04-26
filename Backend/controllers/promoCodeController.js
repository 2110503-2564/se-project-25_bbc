import Promocode from "../models/PromoCode.js";

export const createPromocode = async (req, res) => {
  try {
    const promoCode = await Promocode.create(req.body);
    return res.status(201).json({ success: true, promoCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const usePromocode = async (req, res) => {
    try {
      const { code } = req.body;
  
      const promoCode = await Promocode.findOne({ code });
  
      // Check if expired
      if (new Date() > promoCode.expire) {
        return res.status(400).json({ success: false, message: "Promo code has expired" });
      }
  
      // Check usage limit
      if (promoCode.limit !== null && promoCode.usage >= promoCode.limit) {
        return res.status(400).json({ success: false, message: "Promo code usage limit exceeded" });
      }
  
      promoCode.usage += 1;
      await promo.save();
  
      return res.status(200).json({
        success: true,
        message: "Promo code applied successfully",
        promoCode
      });
  
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
