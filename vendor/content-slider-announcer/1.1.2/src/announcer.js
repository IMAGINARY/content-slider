/* eslint-disable import/no-extraneous-dependencies */
import Durden from '@imaginary-maths/durden';
import TextPoster from '@imaginary-maths/text-poster';

export default class Announcer {
  constructor() {
    this.container = window.document.createElement('div');
    this.container.classList.add('content-slider-announcement');
    window.document.querySelector('body').append(this.container);

    this.bgContainer = window.document.createElement('div');
    this.bgContainer.classList.add('content-slider-announcement-bg');
    this.container.append(this.bgContainer);

    this.txtContainer = window.document.createElement('div');
    this.txtContainer.classList.add('content-slider-announcement-txt');
    this.container.append(this.txtContainer);

    this.tiler = null;

    this.runningTween = null;
  }

  announce(text, userOptions = {}) {
    const defaultOptions = {
      tilesAcross: 8,
      tilesVertically: 20,
      startAngle: 150,
      endAngle: Durden.MIN_ANGLE,
      fadeInDuration: 5000,
      transformLoopDuration: 30000,
      strokeWidth: 1,
      strokeColor: '#000000',
      themes: [],
    };
    const options = Object.assign({}, defaultOptions, userOptions);

    this.tiler = new Durden.Durden(
      this.bgContainer,
      options.tilesAcross,
      options.tilesVertically,
      options.startAngle
    );
    this.tiler.setStroke(options.strokeWidth, options.strokeColor);
    // Color randomly with a default in case selecting a theme fails
    // because it was overriden with something in the wrong format
    this.tiler.colorTilesPeriodic(Announcer.DEFAULT_COLORS);
    this.selectTheme(options);
    this.tiler.setTileVisibility(false);
    this.runningTween = this.tiler.showTilesRandom(options.fadeInDuration).onComplete(() => {
      this.runningTween = this.tiler.transformTilesAnimated(
        options.transformLoopDuration,
        options.startAngle,
        options.endAngle,
        true
      );
      TextPoster.render(this.txtContainer, text);
      setTimeout(() => {
        this.txtContainer.classList.add('visible');
      }, 0);
    });
  }

  selectTheme(options) {
    const { themes } = options;
    if (themes.length > 0) {
      const themeName = themes[Math.floor(Math.random() * themes.length)];
      const theme = options[`theme_${themeName}`];
      if (theme && theme.mode && theme.colors instanceof Array) {
        if (theme.mode === 'random-supertile') {
          this.tiler.colorSuperTilesRandom(theme.colors);
        } else if (theme.mode === 'periodic-supertile') {
          this.tiler.colorSuperTilesPeriodic(theme.colors);
        } else if (theme.mode === 'periodic') {
          this.tiler.colorTilesPeriodic(theme.colors);
        } else {
          this.tiler.colorTilesRandom(theme.colors);
        }
      }
    }
  }

  hide(duration = 2000) {
    if (this.runningTween != null) {
      this.runningTween.stop();
    }
    this.txtContainer.classList.remove('visible');
    this.runningTween = this.tiler.hideSuperTilesOrdered(duration);
  }
}

Announcer.DEFAULT_COLORS = ['#BF1736', '#0D1440', '#1438A6', '#0E2773'];
