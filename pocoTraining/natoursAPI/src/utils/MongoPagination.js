class MongoPaginationPipeline {
  constructor(T) {
    this.pipeline = [];
  }
  setPipeline(pipeline = []) {
    this.pipeline = pipeline;
  }

  //FILTER
  filter = (query) => {
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let json = JSON.parse(queryStr);
    for (let obj in json) {
      if (json[obj] instanceof Object) {
        Object.keys(json[obj]).forEach((key) => {
          Object.values(json[obj]).forEach((value) => {
            json[obj][key] = ~~value;
          });
        });
      }
    }
    console.log();
    this.pipeline.push({
      $match: json,
    });
  };

  //SORT
  sort = (query) => {
    if (query.sort) {
      const { sortBy: sort, sortOrder } = query;
      this.pipeline.push({ $sort: { [sortBy]: sortOrder || 1 } });
    } else {
      this.pipeline.push({ $sort: { createdDate: 1 } });
    }
  };

  project(pipeline) {
    this.pipeline.push(pipeline);
  }

  serve = (project, query) => {
    this.setPipeline();
    this.filter(query);
    this.sort(query);
    this.project(project);
    console.log(this.pipeline);
    return this.pipeline;
  };
}
export default MongoPaginationPipeline;
