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
  multerStorage = (dest, modelName) => ({
    destination: (req, file, cb) => {
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      // id = req.user._id;
      cb(null, `${modelName}-id-${Date.now()}.${ext}`);
    },
  });

  multerImageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('fail'), false);
    }
  };
}
export default FactoryService;
