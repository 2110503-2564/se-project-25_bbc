export function getRoomId(userId, adminId) {
    return [userId, adminId].sort().join('_');
}