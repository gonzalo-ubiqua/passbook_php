import { Directive, Input, ElementRef, EventEmitter, HostListener, HostBinding, OnDestroy, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[HTML5dropable]'
})
export class HTML5DropableDirective implements OnInit, OnDestroy {
  // @Input('HTML5dropable')
  isDropable: boolean;
  // @Output() private dragenter: EventEmitter<any> = new EventEmitter();
  // @Output() private dragover: EventEmitter<any> = new EventEmitter();
  // @Output() private dragleave: EventEmitter<any> = new EventEmitter();

  @Input('bordeDef') public border_def = '0px solid red';
  @Input('dropBordeDef') public drop_border_def = '1px solid red';
  @Output()
  private drop: EventEmitter<any> = new EventEmitter();
  @HostBinding('style.outline')
  public elementBorder = '';
  // @HostListener('dragenter', ['$event']) public onDragenter(event) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     this.elementBorder = '1px solid red';
  //     // this.dragenter.emit(event);
  // }
  @HostListener('dragover', ['$event'])
  public onDragover(event) {
      console.log('HTML5DropableDirective::dragover->@HostListener');
      event.preventDefault();
      event.stopPropagation();
      this.elementBorder = this.drop_border_def;
  }
  @HostListener('dragleave', ['$event'])
  public onDragleave(event) {
      console.log('HTML5DropableDirective::dragleave->@HostListener');
      event.preventDefault();
      event.stopPropagation();
      this.elementBorder = this.border_def;
  }

  @HostListener('drop', ['$event'])
  public onDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      this.elementBorder = this.border_def;

      // const files = evt.dataTransfer.files;
      // if ( files.length > 0 ) {
      //   this.filesChangeEmiter.emit(files);
      // }
      console.log('HTML5DropableDirective::drop->@HostListener');
      // if (event.dataTransfer && event.dataTransfer.files.length) {
      //   this.drop.emit(event);
      // }
  }

  constructor(public element: ElementRef) {
  }

  ngOnInit() {
  }
  //
  ngOnDestroy() {
  }
}
