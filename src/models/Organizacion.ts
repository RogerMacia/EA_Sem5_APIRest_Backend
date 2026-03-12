import mongoose, { Document, Schema, Types } from 'mongoose';
import Usuario, { IUsuario } from './Usuario';

export interface IOrganizacion {
    name: string;
    Users?: IUsuario[];
}

export interface IOrganizacionModel extends IOrganizacion, Document {
}

const OrganizacionSchema: Schema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        versionKey: false
    }
);

OrganizacionSchema.virtual('Users', {
    ref: 'Usuario',
    localField: '_id',
    foreignField: 'organizacion',
    justOne: false,
})

OrganizacionSchema.pre('findOneAndDelete', async function (next) {
    const organizacionId = this.getQuery()._id;
    await mongoose.model('User').deleteMany({ organizacion: organizacionId });
    next();
})

export default mongoose.model<IOrganizacionModel>('Organizacion', OrganizacionSchema);
