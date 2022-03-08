class productFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const q = this.queryStr.q
      ? {
          name: {
            $regex: this.queryStr.q,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...q });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFiled = ["q", "page", "limit"];
    removeFiled.forEach((key) => delete queryCopy[key]);

    // filter for price nad rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (rep) => `$${rep}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(parPageResult) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skipProduct = parPageResult * (currentPage - 1);

    this.query = this.query.limit(parPageResult).skip(skipProduct);

    return this;
  }
}

module.exports = productFilter;
