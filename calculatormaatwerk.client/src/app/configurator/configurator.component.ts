import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowSill } from '../models/windowsill.model';
import { HttpProductService } from '../httpproduct.service';
import { IWindowSillConfiguration } from '../models/windowsillconfiguration.model';
import _, { get } from 'lodash';
import { IProductProperties } from '../models/windowsillconfigurationproperties.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IWindowsillPictures } from '../models/windowsillpictures.model';
import { IProduct } from '../models/product.model';
import { Action } from '../models/actionenum.model';
import { IProductRequestMessage } from '../models/productrequestmessage.model';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {
  @Input() windowsillWithId!: WindowSill;
  @Input() windowsillConfiguration: IWindowSillConfiguration[] = [];
  @Input() productproperties!: IProductProperties;
  @Input() windowsillPictures: IWindowsillPictures[] = [];
  @Input() order!: IProductRequestMessage;
  @Input() valuta: string = '';
  windowsillConfig!: IWindowSillConfiguration;
  selectedImage: string | null = null;
  constructor(private service: HttpProductService, private route: ActivatedRoute, private router: Router, private translate: TranslateService) { }
  CheckboxStates: { [key: string]: boolean } = {};
  InputValuesNonMeasurements: { [key: string]: string } = {};
  OptionsActive: { [key: string]: boolean } = {};
  InputValues: { [key: string]: string } = {};
  deepWindowsillConfigs: IWindowSillConfiguration[] = [];
  deepwindowsillConfig!: IWindowSillConfiguration;
  isDescriptionVisible: boolean = false;
  isPropertiesVisible: boolean = false;
  isApplicationVisible: boolean = false;
  isErrorVisible: boolean = false;  isErrorVisibleLabel: boolean = false;
  combinedValue: string = "";
  calculatedPrice: string = "";
  lang: string = '';
  store: string = '';
  isFilledIn: boolean = false;
  maxlength: number = 200;
  anouncement: string = "";
  inputValidity: { [key: string]: boolean } = {};
  

  ngOnInit(): void {
    this.deepWindowsillConfigs = _.cloneDeep(this.windowsillConfiguration);
    this.deepwindowsillConfig = _.cloneDeep(this.windowsillConfig);
    const id = this.route.snapshot.paramMap.get('id');
    const path = this.router.url.split('?')[0];
    const segments = path.split('/');

    this.store = segments[1];
    this.lang = segments[2];
    this.service.checkIfStoreHasValuta(this.store).subscribe(valuta => { this.valuta = valuta; });
    // Set the language for translations
    this.translate.use(this.lang).subscribe(() => {
    });

    const orderInStorage = Number(sessionStorage.getItem('order'));
    if (orderInStorage) {
      this.service.getOrder(this.store, this.lang, orderInStorage).subscribe(order => {
        this.order = order;
      });
    }

    if (id !== null) {
      const windowsill = sessionStorage.getItem('windowsillWithId');
      if (windowsill) {
        this.windowsillWithId = JSON.parse(windowsill);
      }
      this.service.GetWindowsillByIdPictures(this.store, id).subscribe(pictures => {
        this.windowsillPictures = Array.isArray(pictures) ? pictures : [pictures];
      });

      this.service.GetWindowsillConfigurationPropertiesById(this.store, this.lang, id).subscribe(productproperties => {
        this.productproperties = productproperties;
      });
    }

    this.service.GetWindowsillConfigurator(this.store, this.lang).subscribe(windowsillconfig => {
      this.windowsillConfiguration = windowsillconfig.map(config => {
        config.option = config.option.trim();
        return config;
      });
  
      // Initialize all options as active (open)
      this.OptionsActive = {};
      this.windowsillConfiguration.forEach(config => {
        this.OptionsActive[config.option] = false;
        this.toggleContentConfiguration(config);
      });
    });


    // Log a translated value to verify
    this.translate.get('place').subscribe((res: string) => {
    });
  }

  getMainImage(): string | null {
    const mainImage = this.windowsillPictures.find(picture => picture.isMainImage);
    return mainImage ? mainImage.image : null;
  }

  checkForConfiguration(): boolean {
    const type = this.getTypeOfConfiguration();
    const place = this.getPlaceOfConfiguration();
    if (place == "" || type == "") {
      return false;
    }
    return true;
  }

  toggleVisibility(section: string): void {
    if (section === 'description') {
      this.isDescriptionVisible = !this.isDescriptionVisible;
    } else if (section === 'properties') {
      this.isPropertiesVisible = !this.isPropertiesVisible;
    } else if (section === 'application') {
      this.isApplicationVisible = !this.isApplicationVisible;
    }
  }

  toggleContentConfiguration(IWindowSillConfiguration: IWindowSillConfiguration) {
    const configKey = IWindowSillConfiguration.option;
    // Toggle the clicked option
  // this.OptionsActive[configKey] = !this.OptionsActive[configKey];
    if (this.OptionsActive[configKey]) {
      this.OptionsActive[configKey] = false;
     // this.windowsillConfig = {} as IWindowSillConfiguration; // Reset the active configuration
    } else {
    //  this.OptionsActive = {}; // Reset all options
      this.OptionsActive[configKey] = true;
     // this.windowsillConfig = IWindowSillConfiguration;
    }
  }

  getPropertiesAsArray(): string[] {
    return this.productproperties.properties.split(',').map(word => word.trim());
  }

  checkIfActive(content: string): boolean {
    return this.OptionsActive[content] || false;
  }


  onInputChange(option: string, event: Event, configuration: IWindowSillConfiguration): void {
    const input = event.target as HTMLInputElement;
    this.InputValues[option] = input.value;
  }

  getMaxValue(option: string) {
    if (option === "Breedte" || option === "Largeur") {
      return this.windowsillWithId.maxWidth;
    } else if (option === "Totale lengte" || option === "Longueur totale") {
      return 30000;
    } else {
      return this.windowsillWithId.maxLength;
    }
  }

  onValidityChange(option: string, isValid: boolean): void {
    this.inputValidity[option] = isValid;
    this.isErrorVisible = !isValid || Object.values(this.inputValidity).some(valid => !valid);
  }
 

  getMinValue(option: string) {
    if (option === "Breedte" || option === "Largeur") {
      return this.windowsillWithId.minWidth;
    }
    else {
      return this.windowsillWithId.minLength;
    }
  }
  getProperties(): { name: string, value: any }[] {
    const excludedKeys = ['id', 'referenceCoeck', 'referenceStore', 'store','isExclBtw', 'picture', 'gsrn', 'name', 'language'];
    return Object.keys(this.windowsillWithId)
      .filter(key => !excludedKeys.includes(key))
      .map(key => ({
        name: key,
        value: this.windowsillWithId[key as keyof WindowSill]
      }));
  }

  isValueChanged(event: Event, key: string, configuration: IWindowSillConfiguration): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    // Uncheck all other checkboxes in the same configuration
    if (isChecked) {
      configuration.options.forEach(option => {
        if (option !== key) {
          this.CheckboxStates[option] = false;
        }
      });
    }

    // Update the state of the current checkbox
    this.CheckboxStates[key] = isChecked;
  this.windowsillConfig = configuration;

    // Update the deep copy of the configuration
    this.deepwindowsillConfig = _.cloneDeep(this.windowsillConfig);

    if (Array.isArray(this.deepwindowsillConfig.options)) {
      if (isChecked) {
        this.deepwindowsillConfig.options.splice(0, this.deepwindowsillConfig.options.length);
        this.deepwindowsillConfig.options.push(key);
      } else {
        // Clear the options array when the checkbox is unchecked
        this.deepwindowsillConfig.options.splice(0, this.deepwindowsillConfig.options.length);
      }

      // Check if deepWindowsillConfigs already has a configuration with the same option
      const existingConfigIndex = this.deepWindowsillConfigs.findIndex(config => config.option === this.deepwindowsillConfig.option);
      if (existingConfigIndex > -1) {
        // Replace the existing configuration
        this.deepWindowsillConfigs[existingConfigIndex] = this.deepwindowsillConfig;
      } else {
        // Add the new configuration
        this.deepWindowsillConfigs.push(this.deepwindowsillConfig);
      }


      // If the key is 'place' or 'type', remove the object with option 'measurements'
      if (configuration.option === "place" || configuration.option === "type") {
        this.deepWindowsillConfigs = this.deepWindowsillConfigs.filter(config => config.option !== 'measurements');
        this.clearMeasurementValues();
      }
      if(configuration.option === "polishing"){
        this.calculateTotalSquareMeter();
      }

    }
  }
  saveCombinedValue(event: Event, key: string, configuration: IWindowSillConfiguration): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.checkMaxLength();
    this.updateConfiguration("Opmerking", value, configuration);
  }
  SaveValueInput(event: Event, key: string, configuration: IWindowSillConfiguration): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length > 0) {
        if (configuration.option !== key) {
          this.InputValuesNonMeasurements[configuration.option] = value;
        }
      ;
    }
    this.checkMaxLength();
    this.updateConfiguration(key, value, configuration);
  }
  checkMaxLength() {
    this.isErrorVisible = this.anouncement.length >= this.maxlength;
  }

  checkMaxLengthlabel() {
    this.isErrorVisibleLabel = this.anouncement.length >= this.maxlength;
  }

  clearMeasurementValues(): void {
    const measurementKeys = [
      'Breedte', 'Lengte', 'Lengte kortste zijde vensterbank 1', 'Lengte langste zijde vensterbank 1', 'Lengte kortste zijde vensterbank 2', 'Lengte langste zijde vensterbank 2',
      'Largeur', 'Longueur', 'Longueur côté le plus court tablette 1', 'Longueur côté le plus long tablette 1', 'Longueur côté le plus court tablette 2', 'Longueur côté le plus long tablette 2'
    ];

    measurementKeys.forEach(key => {
      delete this.InputValues[key];
    });
    this.isFilledIn = false;
  }

  updateConfiguration(key: string, value: string, configuration: IWindowSillConfiguration): void {
    // Update the state of the current input field
    this.InputValues[key] = value;

    // Find the index of the configuration with the given option
    const existingConfigIndex = this.deepWindowsillConfigs.findIndex(config => config.option === configuration.option);

    if (existingConfigIndex > -1) {
      // Update the existing configuration
      const existingConfig = this.deepWindowsillConfigs[existingConfigIndex];
      const existingOptionIndex = existingConfig.options.findIndex(option => option === key);

      if (value !== '') {
        if (existingOptionIndex > -1) {
          existingConfig.options[existingOptionIndex + 1] = value;
        } else {
          existingConfig.options.push(key);
          existingConfig.options.push(value);
        }
      } else {
        if (existingOptionIndex > -1) {
          existingConfig.options.splice(existingOptionIndex, 2);
          if (existingConfig.options.length === 0) {
            this.deepWindowsillConfigs.splice(existingConfigIndex, 1);
          }
        }
      }
    } else if (value !== '') {
      // Add the new configuration
      const newConfig = _.cloneDeep(configuration);
      newConfig.options = [key, value];
      this.deepWindowsillConfigs.push(newConfig);
    }

  }

  isNumberValueChanged(event: Event, key: string, configuration: IWindowSillConfiguration): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.updateConfiguration(key, value, configuration);
  }

  getActiveOption(configuration: IWindowSillConfiguration): string {
    const activeOption = configuration.options.find(option => this.CheckboxStates[option]);
    return activeOption ? activeOption : '';
  }

  getActiveValue(configuration: IWindowSillConfiguration): string {
    const activeOption = configuration.options.find(option => this.InputValuesNonMeasurements[option]);
    return activeOption ? this.InputValuesNonMeasurements[activeOption] : '';
   //
  }

  getTypeOfConfiguration(): string {
    if (this.deepWindowsillConfigs.length > 0) {
      const typeOption = this.deepWindowsillConfigs.find(config => config.option === 'type');
      if (typeOption) {
        return typeOption.options[0].toString();
        // Use the type variable here
      }
    }
    return '';
  }

  getOnlayConfiguration(): string {
    if (this.deepWindowsillConfigs.length > 0) {
      const onlayOption = this.deepWindowsillConfigs.find(config => config.option === 'polishing');
      if (onlayOption && onlayOption.options.length > 0) {
        return onlayOption.options[0].toString();
        // Use the onlay variable here
      }
      return 'geen';
    }
    return 'geen';
  }

  checkIfBtw(): { code: string, value: string } | void {
  if( this.windowsillWithId.isExclBtw)
  {
    return {code: "BTW", value: "true"};
  }
  }


  getPictureMeasurements(): { code: string, value: string }[] {
    const typeConfiguration = this.getTypeOfConfiguration();
    const measurements = this.deepWindowsillConfigs.find(config => config.option === 'measurements');

    const configurationMap: { [key: string]: number[] } = {
      'Rechte vensterbank': [1, 3],
      'Tablette de fenêtre droite': [1, 3],
      'Binnenhoek 45 graden': [1, 3, 5],
      'Onglet intérieur de 45°': [1, 3, 5],
      'Buitenhoek 45 graden': [1, 3, 5],
      'Onglet extérieur de 45°': [1, 3, 5], 
      'Aaneensluitende vensterbank': this.anouncement === '' ? [1, 3] : [1, 3, 5],
      'Rebord de fenêtre contigu':this.anouncement === '' ? [1, 3] : [1, 3, 5],
    };

    const indices = configurationMap[typeConfiguration] || [];
    return indices.map((index, i) => ({
      code: measurements?.options[index - 1].toString() ?? '',
      value: measurements?.options[index].toString().concat(
      (typeConfiguration === 'Aaneensluitende vensterbank' || typeConfiguration === 'Rebord de fenêtre contigu') && i === indices.length - 1 ? '' : ' mm'
      ) ?? ''
    }));
  }

  getNickname(): {code: string, value: string} | undefined {
    const nickname = this.deepWindowsillConfigs.find(config => config.option === 'nickname');
    if (nickname) {
      return {code: "Nickname", value: nickname.options[1].toString()};
    }
    return undefined;
  }

  calculateTotalSquareMeter(): string {
    let totalSquareMeter = 0;
    let onlayPrice = 14.92;
    let onlay = 0;
    this.deepWindowsillConfigs.forEach(config => {
      if (config.option === "measurements" && (this.getTypeOfConfiguration() === 'Rechte vensterbank' || this.getTypeOfConfiguration() === 'Tablette de fenêtre droite' || this.getTypeOfConfiguration() === 'Aaneensluitende vensterbank' || this.getTypeOfConfiguration() === 'Rebord de fenêtre contigu')) {
        const length = parseFloat(config.options[1] as string);
        const width = parseFloat(config.options[3] as string);
        if (!(this.getOnlayConfiguration() === 'none')) {
          onlay = width/1000 * onlayPrice;
        }
        totalSquareMeter += length * width;
      } else if (config.option === 'measurements') {

        const length = parseFloat(config.options[1] as string);
        const width = parseFloat(config.options[3] as string);
        const width2 = parseFloat(config.options[5] as string);
        if (!(this.getOnlayConfiguration() === 'none')) {
          onlay = (width/ 1000 * onlayPrice) + (width2/ 1000 * onlayPrice);
        }
        totalSquareMeter += length * (width + length) + (length * (width2 + length)) + 8.2;
      }
    });

    this.calculatedPrice = ((totalSquareMeter / 1000000 * this.windowsillWithId.price) + onlay).toFixed(2);
    if (this.isErrorVisible) {
    return "0.00";
    }
    if (isNaN(Number(this.calculatedPrice))) {
      this.isFilledIn = false;
      return "0.00";
    }
    if (!isNaN(Number(this.calculatedPrice)) && this.calculatedPrice != "0.00" && Object.values(this.inputValidity).every(valid => valid)) {
      this.isFilledIn = true;
    }
    return this.calculatedPrice;
  }

  getPlaceOfConfiguration(): string {
    if (this.deepWindowsillConfigs.length > 0) {
      const placeOption = this.deepWindowsillConfigs.find(config => config.option === 'place');
      if (placeOption) {
        return placeOption.options[0].toString();
        // Use the place variable here
      }
    }
    return '';
  }

  CheckIfCombined(): boolean {
    const typeConfiguration = this.getTypeOfConfiguration();
    if (typeConfiguration === 'Aaneensluitende vensterbank' || typeConfiguration === 'Rebord de fenêtre contigu') {
      return true;
    }
    return false;
  }

  fillInConfigurationMeasurements(options: string[]): string[] {
    const typeConfiguration = this.getTypeOfConfiguration();
    const configurationMap: { [key: string]: string[] } = {
      'Rechte vensterbank': ['Breedte', 'Lengte'],
      'Tablette de fenêtre droite': ['Largeur', 'Longueur'],
      'Binnenhoek 45 graden': ['Breedte', 'Lengte langste zijde vensterbank 1', 'Lengte langste zijde vensterbank 2'],
      'Onglet intérieur de 45°': ['Largeur', 'Longueur côté le plus long tablette 1', 'Longueur côté le plus long tablette 2'],
      'Buitenhoek 45 graden': ['Breedte', 'Lengte kortste zijde vensterbank 1', 'Lengte kortste zijde vensterbank 2'],
      'Onglet extérieur de 45°': ['Largeur', 'Longueur côté le plus court tablette 1', 'Longueur côté le plus court tablette 2'],
      'Aaneensluitende vensterbank': ['Breedte', 'Totale lengte'],
      'Rebord de fenêtre contigu': ['Largeur', 'Longueur totale']
    };

    const keys = configurationMap[typeConfiguration] || [];
    return keys.map(key => options.find(option => option === key) ?? '');
  }

  getPictureMeasurementInstructions(): string {
    const typeConfiguration = this.getTypeOfConfiguration();
    const placeConfiguration = this.getPlaceOfConfiguration();

    const urlMap: { [key: string]: { [key: string]: string } } = {
      'Vensterbank tussen muur': {
        'Rechte vensterbank': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_tussen_muur_tekengebied_1.jpg',
        'Binnenhoek 45 graden': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_tussen_muur_45deg_verstek_binnenhoek_tekengebied_1.jpg',
        'Buitenhoek 45 graden': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_tussen_muur_45deg_verstek_buitenhoek_tekengebied_1.jpg',
        'Aaneensluitende vensterbank': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/aaneensluitendtussen.png',
      },
      'Tablette de fenêtre entre un mur': {
        'Tablette de fenêtre droite': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_tussen_muur_tekengebied_1.jpg',
        'Onglet intérieur de 45°': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_tussen_muur_45deg_verstek_binnenhoek_tekengebied_1.jpg',
        'Onglet extérieur de 45°': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_tussen_muur_45deg_verstek_buitenhoek_tekengebied_1.jpg',
        'Rebord de fenêtre contigu': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/aaneensluitendtussen.png'
      },
      'Vensterbank ingewerkt in muur': {
        'Rechte vensterbank': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_ingewerkt_in_muur_tekengebied_1_0.jpg',
        'Binnenhoek 45 graden': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_ingewerkt_in_muur_45deg_verstek_binnenhoek_tekengebied_1.jpg',
        'Buitenhoek 45 graden': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_ingewerkt_in_muur_45deg_verstek_buitenhoek_tekengebied_1.jpg',
        'Aaneensluitende vensterbank': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/aaneensluitendingewerkt.png',
      },
      'Tablette intégrée dans le mur': {
        'Tablette de fenêtre droite': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_ingewerkt_in_muur_tekengebied_1_0.jpg',
        'Onglet intérieur de 45°': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_ingewerkt_in_muur_45deg_verstek_binnenhoek_tekengebied_1.jpg',
        'Onglet extérieur de 45°': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/vensterbank_ingewerkt_in_muur_45deg_verstek_buitenhoek_tekengebied_1.jpg',
        'Rebord de fenêtre contigu': 'https://calculatorstoragecoeck.blob.core.windows.net/producten/vensterbanken/aaneensluitendingewerkt.png'
      }
    };
    return urlMap[placeConfiguration]?.[typeConfiguration] || '';
  }


  showBigPicture(url: string) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const image = document.createElement('img');
    image.src = url;
    image.style.maxWidth = '90%';
    image.style.maxHeight = '90%';

    overlay.appendChild(image);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
  }

  GoBackToMain(): void {
    this.router.navigate([`${this.store}/${this.lang}`]);
  }

  goToProductConfigerdlist(): void {
    const windowsillWithId = sessionStorage.getItem('windowsillWithId');
    const orderr: IProductRequestMessage = {
      action: Action.CHANGE_PRODUCT,
      products: [],
      signature: ''
    };
    if (!this.order) {
      this.order = orderr;
    }

    if (windowsillWithId && !isNaN(Number(this.calculatedPrice))) {
      const windowsill = JSON.parse(windowsillWithId) as WindowSill;
      const newConfigListItems: IProduct[] = [
        {
          title: windowsill.name,
          quantity: 1, // Default quantity, you can adjust as needed
          barcode: "",
          action: Action.ADD, // Default action, you can adjust as needed
          materials: [
            {
              code: "CoeckNumber",
              value: windowsill.referenceCoeck,
            },
            {
              code: "Shape",
              value: this.getTypeOfConfiguration(),
            },
            {
              code: "Place",
              value: this.getPlaceOfConfiguration(),
            },
            {
              code: "Polishing",
              value: this.getOnlayConfiguration(),
            },
            ...this.getNickname() ? [this.getNickname() as { code: string, value: string }] : [],
            ...this.checkIfBtw() ? [this.checkIfBtw() as { code: string, value: string }] : [],
            ...this.getPictureMeasurements(),

          ],
          unitPrice: parseFloat(this.calculatedPrice),
          price: parseFloat(this.calculatedPrice),
          imageUrl: windowsill.picture,
          category: 'Windowsill',
          deliveryTime: '10',
          purchasePrice: parseFloat(this.calculatedPrice).toString()
        }];


      let parsedConfigs: IProduct[] = [];
      parsedConfigs.push(...newConfigListItems);
      if (this.order) {
        const orderObject = this.order;
        orderObject.products.push(...parsedConfigs);
        this.service.postOrder(this.store, this.lang, orderObject).subscribe(id => {
          if (id === null) {
            sessionStorage.removeItem('order');
          } else {
            sessionStorage.setItem('order', JSON.stringify(id));
            this.router.navigate([`${this.store}/${this.lang}/configuredlist`]);
          }
        });
      }
    }
  }

  generateBarcode(): string {
    let barcode = '';
    for (let i = 0; i < 11; i++) {
      barcode += Math.floor(Math.random() * 10).toString();
    }
    return barcode;
  }
}