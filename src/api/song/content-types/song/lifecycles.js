module.exports = {
  afterCreate(event) {
    const { result, params } = event;

    console.log("result:", result);
  },
};
