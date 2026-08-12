const buildUpdateQuery = (data) => {
  const fields = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });
  return { fields, values };
};

module.exports = buildUpdateQuery;
