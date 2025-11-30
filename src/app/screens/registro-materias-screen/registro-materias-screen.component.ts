import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {

  public materia: any = { dias: [] };
  public errors: any = {};
  public editar: boolean = false;
  public listaMaestros: any[] = [];
  private facadeService: FacadeService


  public diasSemana = [
    { nombre: 'Lunes', value: 'Lunes' },
    { nombre: 'Martes', value: 'Martes' },
    { nombre: 'Miércoles', value: 'Miercoles' },
    { nombre: 'Jueves', value: 'Jueves' },
    { nombre: 'Viernes', value: 'Viernes' }
  ];

  public programas: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];

  constructor(
    private location: Location,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService
  ) { }

  ngOnInit(): void {
    this.obtenerMaestros();

    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
    } else {
      this.materia = this.materiasService.esquemaMateria();
    }
  }

  // Servicio para obtener maestros
  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.listaMaestros = response;
        console.log("Maestros cargados: ", this.listaMaestros);
      },
      (error) => {
        console.error("Error al obtener maestros: ", error);
      }
    );
  }

  public regresar() {
    this.location.back();
  }

  // Checkbox logic
  public checkboxChange(event: any, dia: string) {
    if (event.checked) {
      this.materia.dias.push(dia);
    } else {
      this.materia.dias = this.materia.dias.filter((d: string) => d !== dia);
    }
  }

  public registrar() {
    this.errors = this.materiasService.validarMateria(this.materia);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }
    this.materiasService.registrarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia registrada correctamente");
        this.router.navigate(["/materias"]);
      },
      (error) => {
        alert("Error al registrar");
      }
    );
  }


  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // A-Z, a-z, espacio (32)
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 32) {
      event.preventDefault();
    }
  }

  public soloAlfanumerico(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      !(charCode >= 48 && charCode <= 57) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
