import lang from 'dojo/_base/lang'
import Logger from 'common/Logger'
import CoreUtil from 'core/CoreUtil'

class ModelUtil {

    constructor() {
      this.logger = new Logger("ModelUtil");
    }


    inlineTemplateModifies(model) {
      if (model.templates) {

          for (let widgetID in model.widgets) {
              let widget = model.widgets[widgetID]
              if (widget.template) {
                var t = model.templates[widget.template];
                widget._templateModified = t.modified
                console.debug(widget.name, widget._templateModified)
              }
          }
        }
        return model
    }

    inlineTemplateStyles(model) {
      for (let widgetID in model.widgets) {
          let widget = model.widgets[widgetID]
          if (widget.template) {

              let hover = this.getTemplatedStyle(widget, model, 'hover')
              if (hover) {
                  widget.hover = hover
              }
              let error = this.getTemplatedStyle(widget, model, 'error')
              if (error) {
                  widget.error = error
              }
              let focus = this.getTemplatedStyle(widget, model, 'focus')
              if (focus) {
                  widget.focus = focus
              }
              let active = this.getTemplatedStyle(widget, model, 'active')
              if (active) {
                  widget.active = active
              }
          }

      }
      return model
  }

  getTemplatedStyle(widget, model, prop) {
      if (widget.template) {
          if (model.templates) {
              var t = model.templates[widget.template];
              if (t && t[prop]) {
                  /**
                   * Merge in overwriten styles
                   */
                  var merged = lang.clone(t[prop])
                  if (widget[prop]) {
                      let props = widget[prop]
                      for (var key in props) {
                          merged[key] = props[key]
                      }
                  }
                  return merged;
              }
          }
      }
      return widget[prop];
  }

  createScalledModel(model, zoom) {
    this.logger.log(3, "Core.createScalledModel", "enter > " + zoom + " > ");


    var zoomedModel = lang.clone(model);
    zoomedModel.isZoomed = true;

    this.getZoomedBox(zoomedModel.screenSize, zoom, zoom);

    for (let id in zoomedModel.widgets) {
      this.getZoomedBox(zoomedModel.widgets[id], zoom, zoom);
    }

    for (let id in zoomedModel.screens) {
        var zoomedScreen = this.getZoomedBox(
            zoomedModel.screens[id],
            zoom,
            zoom
        );

        /**
         * This has a tiny tiny bug that makes copy of the same screen jump as x and y and rounded()
         * To fix this, we should take the relative and x and y in the parent and round that...
         *
         * scalledWidget.x = scalledScreen.x + (orgWidget.x - orgScreen.x)*zoomX
         *
         * As an alternative we could stop using Math.round() ...
         */
        for (let i = 0; i < zoomedScreen.children.length; i++) {
            let wid = zoomedScreen.children[i];
            let zoomWidget = zoomedModel.widgets[wid];
            let orgWidget = model.widgets[wid];
            if (orgWidget) {
                /**
                 * When we copy a screen we might not have the org widget yet
                 */
                var orgScreen = model.screens[zoomedScreen.id];
                var difX = this.getZoomed(orgWidget.x - orgScreen.x, zoom);
                var difY = this.getZoomed(orgWidget.y - orgScreen.y, zoom);
                if (orgWidget.parentWidget) {
                    if (zoomWidget.x >= 0) {
                        zoomWidget.x = zoomedScreen.x + difX;
                    }
                    if (zoomWidget.y >= 0) {
                        zoomWidget.y = zoomedScreen.y + difY;
                    }
                } else {
                    zoomWidget.x = zoomedScreen.x + difX;
                    zoomWidget.y = zoomedScreen.y + difY;
                }
            }
        }
    }

    for (let id in zoomedModel.lines) {
        let line = zoomedModel.lines[id];
        for (let i = 0; i < line.points.length; i++) {
          this.getZoomedBox(line.points[i], zoom, zoom);
        }
    }


    return zoomedModel;
  }

  getZoomedBox (box, zoomX, zoomY) {
    return CoreUtil.getZoomedBox(box, zoomX, zoomY, false);
  }

  getZoomed (v, zoom) {
    return CoreUtil.getZoomed(v, zoom, false);
  }
}

export default new ModelUtil()