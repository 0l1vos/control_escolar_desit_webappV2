import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMateria() {
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias': [],
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa_educativo': '',
      'profesor': '',
      'creditos': ''
    }
  }

  public validarMateria(data: any) {
    let error: any = {};

    if (!this.validatorService.required(data["nrc"])) {
      error["nrc"] = "El NRC es obligatorio";
    } else if (!this.validatorService.numeric(data["nrc"])) {
      error["nrc"] = "Solo números permitidos";
    }

    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = "El nombre es obligatorio";
    }

    if (!this.validatorService.required(data["seccion"])) {
      error["seccion"] = "La sección es obligatoria";
    }

    if (!data["dias"] || data["dias"].length === 0) {
      error["dias"] = "Selecciona al menos un día";
    }

    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = "Hora inicio requerida";
    }
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = "Hora fin requerida";
    }
    // Validación de horario
    if (data["hora_inicio"] && data["hora_fin"]) {
      if (this.convertToMinutes(data["hora_inicio"]) >= this.convertToMinutes(data["hora_fin"])) {
        error["hora_inicio"] = "La hora inicio debe ser menor a la final";
      }
    }

    if (!this.validatorService.required(data["salon"])) {
      error["salon"] = "El salón es obligatorio";
    }

    if (!this.validatorService.required(data["programa_educativo"])) {
      error["programa_educativo"] = "Selecciona un programa";
    }

    if (!this.validatorService.required(data["profesor"])) {
      error["profesor"] = "Asigna un profesor";
    }

    if (!this.validatorService.required(data["creditos"])) {
      error["creditos"] = "Ingresa créditos";
    }

    return error;
  }

  // Auxiliar para horas
  private convertToMinutes(timeString: string): number {
    if (!timeString) return 0;
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12 && modifier === 'AM') hours = 0;
    if (modifier === 'PM' && hours !== 12) hours += 12;
    return hours * 60 + minutes;
  }

  // ==========================================
  // SERVICIOS HTTP (Aquí estaban faltando)
  // ==========================================

  public registrarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${environment.url_api}/materia/`, data, { headers });
  }

  public obtenerListaMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    // OJO: Verifica que tu endpoint sea /lista-materias/ o el que tengas en Django
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
  }

  public obtenerMateriaPorID(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${environment.url_api}/materia/?id=${idMateria}`, { headers });
  }

  public actualizarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put<any>(`${environment.url_api}/materia/`, data, { headers });
  }

  // ESTA ES LA QUE FALTABA PARA EL MODAL
  public eliminarMateria(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete<any>(`${environment.url_api}/materia/?id=${idMateria}`, { headers });
  }
}
