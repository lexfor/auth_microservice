import { ICreatePatientMessage } from './create-patient-message.interface';
import { Observable } from 'rxjs';
import { IPatientMessage } from './patient-message.interface';

export interface IPatientService {
  createPatient(data: ICreatePatientMessage): Observable<IPatientMessage>;
}
