import { Component, Input, OnInit, Sanitizer } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Type } from 'src/app/models/type.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-types',
  templateUrl: './pokemon-types.component.html',
  styleUrls: ['./pokemon-types.component.scss']
})
export class PokemonTypesComponent implements OnInit {
  @Input() types: Type[] = []; // Se espera recibir una lista de tipos de Pokémon

  typeImageUrls: { name: string, url: Observable<SafeResourceUrl> }[] = [];

  constructor(private http: HttpClient, private _sanitizer: DomSanitizer) {}

  ngOnInit() {
  }

  getSVGUrl(typeName: string): SafeResourceUrl {
    return this.getSVGImageUrl(typeName);
  }
  
  getSVGImageUrl(typeName: string): SafeResourceUrl {
    const svgUrl = `assets/icon/${typeName}.svg`;

    // Crear una URL segura para el SVG
    const url = this._sanitizer.bypassSecurityTrustResourceUrl(svgUrl);
    return url;
  }
}
