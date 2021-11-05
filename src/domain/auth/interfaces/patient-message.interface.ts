import { ICreatePatientMessage } from './create-patient-message.interface';

export interface IPatientMessage extends ICreatePatientMessage {
  id: string;
}
