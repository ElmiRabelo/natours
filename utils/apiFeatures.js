class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(field => delete queryObj[field]);

    // advanced filtering
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    // BUILD A QUERY
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      this.query = this.query.sort(this.reqQuery.sort.replace(/,/g, ' '));
    } else {
      this.query = this.query.sort({ _id: -1 });
    }
    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      this.query = this.query.select(this.reqQuery.fields.replace(/,/g, ' '));
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    let queryObj = { ...this.query };
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;

    queryObj = this.query.skip(skip).limit(limit);

    return queryObj;
  }
}

module.exports = APIFeatures;
