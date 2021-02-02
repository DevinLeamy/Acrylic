import { Component, OnInit, OnDestroy } from "@angular/core";
import { CanvasService } from "../../services/canvas";
import { CanvasOptions } from "./canvas";
import { fabric } from "fabric";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ColorEvent } from "ngx-color";
import { MatSliderChange } from "@angular/material/slider";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-canvas-page',
    templateUrl: 'canvas.component.html',
    styleUrls: ['canvas.component.css'],
    providers: [CanvasService]
})
export class CanvasPageComponent implements OnInit, OnDestroy {
  canvas: fabric.Canvas;
  canvas_width = 500;
  canvas_height = 600;
  canvasLoaded: boolean = false;
  undoStack: string[] = [];
  max_undo_depth: number = 100;

  // Default canvas options
  canvasOptions: CanvasOptions = {
    lineWidth: 20,
    isDrawingMode: true,
    color: '#F14D3F'
  }
  canvasSub: Subscription;

  constructor(private canvasService: CanvasService) {}

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas');

    // Listen for changes to canvas
    this.canvas.on('after:render', () => this.storeCanvas());
    this.canvasSub = this.canvasService.getCanvasUpdated().subscribe((canvas: string) => {
      if (this.canvasLoaded) { return; }
      // Load canvas updates
      this.canvas.loadFromJSON(canvas, () => {});
      this.canvasLoaded = true;
    })

    // Retrieve existing canvas
    this.canvasService.getCanvas();

    // Set default canvas options
    this.setCanvasOptions();
  }

  // Sets to current this.canvasOptions
  setCanvasOptions() {
    this.canvas.isDrawingMode = this.canvasOptions.isDrawingMode;
    this.canvas.freeDrawingBrush.width = this.canvasOptions.lineWidth;
    this.canvas.freeDrawingBrush.color = this.canvasOptions.color;
  }

  // Clear the canvas
  onClearCanvas() {
    this.canvas = this.canvas.clear();
    this.storeCanvas();
  }

  // Sets drawing mode
  setDrawingMode(event: MatSlideToggleChange) {
    this.canvasOptions.isDrawingMode = event.checked
    this.setCanvasOptions()
  }

  // Set pen width
  setLineWidth(event: MatSliderChange) {
    this.canvasOptions.lineWidth = event.value;
    this.setCanvasOptions()
  }

  // Set pen color
  setColor(event: ColorEvent) {
    this.canvasOptions.color = event.color.hex;
    this.setCanvasOptions();
  }

  // Adds uploaded image to the canvas
  addImageToCanvas(event: { imagePath: string }) {
    const imagePath = event.imagePath;
    fabric.Image.fromURL(imagePath, (canvasImage) => {
      const left = Math.max(150, Math.random() * this.canvas_width);
      const top = Math.max(150, Math.random() * this.canvas_height);
      const angle = Math.random() * 360;

      canvasImage.scaleToWidth(Math.max(200, 500 * Math.random()));
      canvasImage.set({'left': left, 'top': top, 'angle': angle});

      this.canvas.add(canvasImage);
      this.storeCanvas();
    })
  }

  // Canvas change handler
  storeCanvas() {
    // Save new canvas state
    this.canvasService.persistCanvas(this.canvas)

    // Add canvas state to undo stack
    this.undoStack.push(JSON.stringify(this.canvas));

    if (this.undoStack.length > this.max_undo_depth) {
      // Removes first element from the stack
      this.undoStack.shift();
    }
  }

  // Renders top canvas on undo stack
  undo() {
    if (this.undoStack.length > 1) {
      // Displays second to last frame (prevents undone frame from being re-rendered)
      this.undoStack.pop();
      const canvasData: string = this.undoStack.pop();
      this.canvas.loadFromJSON(canvasData, () => {});
    }
  }
  // Avoid memory leaks
  ngOnDestroy() {
    this.canvasSub.unsubscribe();
  }
}
