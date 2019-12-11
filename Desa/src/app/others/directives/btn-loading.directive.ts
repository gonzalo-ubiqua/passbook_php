/*
  <button type="button" [btnLoading]="icon.recargando" [color]="'red'" [disable_btn]='false' [hidden_content]='false'>
    <span i18n>Recargar</span>
  </button>
*/

import { Directive, ElementRef, Input, AfterViewInit, AfterViewChecked, Renderer2 } from '@angular/core';

@Directive({
  selector: '[btnLoading]'
})
export class BtnLoadingDirective implements AfterViewInit, AfterViewChecked {
  @Input('btnLoading') set loadingChange(new_value: boolean) {    // mandatory
    this.loadingToggle(new_value);
  }
  @Input('color') input_color: string = '';                          // Optional => Default: loadin icon button color
  @Input('disable_btn') input_disable_btn: boolean = true;           // Optional => Disable button while is loading?. Defatult: true
  @Input('hidden_content') input_hidden_content: boolean = true;     // Optional => Must hidden the button contet while loading. Defatult: true

  readonly icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="{{current-style}}"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"</path><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite"/></svg>';
  private element_style: any       = null;
  private wrapper: any = null;
  private svg_element: HTMLElement = null;
  private is_inited = false;

  // ---------------------------------------------------------------------------
  constructor(private Element: ElementRef, private renderer: Renderer2, ) {}

  // ---------------------------------------------------------------------------
  get icon_loading(): string {
    const style = {
      "align-content"   : 'center',
      display           : 'none',
      color             : this.current_color,
      fill              : 'currentColor',
      height            : 'calc(90%)',       // No es un error el uso de offsetHeight
      "justify-content" : 'center',
      left              : '0px',             // No es un error el uso de offsetHeight
      position          : 'absolute',
      top               : '5%',
      width             : '100%'
    }

    let style_string = JSON.stringify(style);
    style_string = style_string.replace(/\"/g, '');
    style_string = style_string.replace(/,/g, ';');
    style_string = style_string.replace(/¬/g, ',');
    style_string = style_string.substr(1, style_string.length-2);

    return this.icon_svg.replace('{{current-style}}', style_string);

  }
  // ---------------------------------------------------------------------------
  get current_color(): string {

    return ( this.input_color?this.input_color.replace(/,\s*/g, '¬'):this.element_style.color.replace(/,\s/g, '¬') );

  }

  // ---------------------------------------------------------------------------
  public ngAfterViewInit(): void {
    const wrapper      = this.renderer.createElement('div');
    this.element_style = window.getComputedStyle(this.Element.nativeElement);

    wrapper.innerHTML = this.Element.nativeElement.innerHTML;

    this.Element.nativeElement.style.position = "relative";
    this.Element.nativeElement.innerHTML = '';
    this.renderer.appendChild(this.Element.nativeElement, wrapper);

    setTimeout( () => {
      this.Element.nativeElement.innerHTML += this.icon_loading;

      this.wrapper     = this.Element.nativeElement.children[0];
      this.svg_element = this.Element.nativeElement.children[1];

      this.is_inited     = true;

    }, 10);
  }

  // ---------------------------------------------------------------------------
  public ngAfterViewChecked(): void {


  }

  // ---------------------------------------------------------------------------
  private loadingToggle(show: boolean): void {
    // ignore change if directive isn't inited
    if ( this.is_inited ) {

      if (show) {
        this.setLoading();
      } else {
        this.unsetLoading();
      }

    }
  }

  // ---------------------------------------------------------------------------
  private setLoading(): void {

    this.svg_element.style.display = 'flex';
    this.input_hidden_content && (this.wrapper.style.opacity = 0);
    this.input_disable_btn && (this.Element.nativeElement.disabled = true);

  }

  // ---------------------------------------------------------------------------
  private unsetLoading(): void {

    this.svg_element.style.display = "none";
    this.input_hidden_content && (this.wrapper.style.opacity = 1);
    this.input_disable_btn && (this.Element.nativeElement.disabled = false);

  }

}
