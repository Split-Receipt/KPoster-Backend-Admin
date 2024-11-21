import CustomDateField from './components/CustomDateField';

export default {
  async register(app) {
    app.addFields({
      type: 'datetime',
      Component: CustomDateField,
    });
  },
};
