class FactoryService {
  constructor(Model) {
    this.Model = Model;
  }

  deleteUndeleteModel = async (flag, id) => {
    const model = await this.Model.findById(id);
    if (!model) {
      throw new Error('error');
    }
    model.deleted = flag;
    await model.save({ validateBeforeSave: false });
    return model;
  };
}
export default FactoryService;
