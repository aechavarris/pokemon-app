import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Type, Weakness } from 'src/app/models/type.model';

@Component({
  selector: 'app-pokemon-types',
  templateUrl: './pokemon-types.component.html',
  styleUrls: ['./pokemon-types.component.scss']
})
export class PokemonTypesComponent implements OnInit {
  @Input() types: Type[] = [];
  @Input() weaknesses: Weakness[] = [];

  // Definir las categorías de debilidades según los valores deseados (4, 2, 0.5, 0.25, 0)
  weaknessCategories = [4, 2, 0.5, 0.25, 0];

  constructor() {}

  ngOnInit() {}

  shouldDisplayWeaknesses(): boolean {
    return this.weaknesses && this.weaknesses.length > 0;
  }

  hasWeaknessesInCategory(value: number): boolean {
    return this.weaknesses.some(weakness => weakness.weakness === value);
  }

  getWeaknessValue(value: number): string {
    if (value === 4) return '4';
    if (value === 2) return '2';
    if (value === 0.5) return '0.5';
    if (value === 0.25) return '0.25';
    if (value === 0) return '0';
    return '';
  }

  getSVGUrl(typeName: string): string {
    return `assets/icon/${typeName}.svg`;
  }
}
@Pipe({
  name: 'getWeaknessesInCategory'
})
export class GetWeaknessesInCategoryPipe implements PipeTransform {
  transform(weaknesses: any[], category: any): any[] {
    // Implementa la lógica para filtrar las debilidades según la categoría
    if (!weaknesses || weaknesses.length === 0 || !category) {
      return [];
    }

    // Ejemplo de implementación básica, ajusta según tu estructura de datos
    return weaknesses.filter(weakness => weakness.category === category);
  }
}