(function (libs) {

  var blocks = [];
  var copies = [];
  var copiesPositions = [];
  var numberOfBlocks = 10;
  var appContainer = libs.$('.app');
  var blockColors = [
    'Red',
    'Pink',
    'Purple',
    'Deep Purple',
    'Indigo',
    'Blue',
    'Light Blue',
    'Cyan',
    'Teal',
    'Orange',
    'Deep Orange',
    'Brown',
    'Blue Grey'
  ];
  var fixedContainer = null;

  init();

  function createBlock(index) {
    var block = document.createElement('div');
    if (index < 9) {
      block.style.marginBottom = 50 + 'px';
    }
    // Content
    var content = document.createElement('div');
    var colorName = libs.pickElementInArray(blockColors);
    var color = libs.palette.palette[colorName][300];
    content.style.background = color;
    var numberOfParagraph = libs.math.randomInt(1, 4);
    for (paraIndex = 0; paraIndex <= numberOfParagraph; paraIndex++) {
      var para = document.createElement('p');
      var numberOfWords = libs.math.randomInt(10, 200);
      para.innerHTML = libs.lipsum.generate(numberOfWords);
      content.appendChild(para);
    }
    content.classList.add('block-content');

    block.classList.add('block');
    block.appendChild(content);
    return block;
  }

  function createBlocks() {
    for (blockIndex = 0; blockIndex < numberOfBlocks; blockIndex++) {
      var block = createBlock(blockIndex);
      appContainer.appendChild(block);
    }
  }

  function findBlocks() {
    blocks = libs.$$('.block');
  }

  function createFixedContainer() {
    fixedContainer = document.createElement('div');
    fixedContainer.style.position = 'fixed';
    fixedContainer.style.top = '0';
    document.body.appendChild(fixedContainer);
  }

  function createCopies() {
    for (bIndex = 0; bIndex < blocks.length; bIndex++) {
      var block = blocks[bIndex];
      var content = block.firstChild;
      var rect = block.getBoundingClientRect();
      block.style.width = rect.width + 'px';
      block.style.height = rect.height + 'px';
      block.style.overflow = 'hidden';
      block.style.background = '#e0e0e0';
      // fixed block
      var copy = document.createElement('div');
      copy.style.width = rect.width + 'px';
      copy.style.height = rect.height + 'px';
      copy.style.position = 'absolute';
      copy.appendChild(block.firstChild);
      copies.push(copy);
      copiesPositions.push({ left: 0, top: 0 });
      fixedContainer.appendChild(copy);
    }
  }

  function update(options) {
    for (index = 0; index < blocks.length; index++) {
      // console.log(blocks[0].getBoundingClientRect());
      var block = blocks[index];
      var copy = copies[index];
      var target = block.getBoundingClientRect();
      var current = copiesPositions[index];
      var left = target.left;
      var top = target.top;
      var opacity = 1;
      if (!(options && options.force)) {
        var left = current.left + ((target.left - current.left) * 0.03);
        var verticalMove = ((target.top - current.top) * 0.03);
        var top = current.top + verticalMove;
        console.log(verticalMove);
        if (verticalMove > 10) {
          opacity = 0.1 + ((verticalMove - 10) / 90) * 0.9;
        }
        if (verticalMove > 100) {
          opacity = 0.1;
        }
      }
      copy.style.transform = 'translate(' + left + 'px, ' + top + 'px)';
      copy.style.opacity = opacity;
      copiesPositions[index] = { left: left, top: top };
    }
    libs.raf(update.bind(this));
  }

  function initUpdate() {
    libs.raf(libs.throttle(update.bind(this), 1000 / 60));
  }

  function init() {
    createBlocks();
    findBlocks();
    libs.raf(function() {
      createFixedContainer();
      createCopies();
      libs.raf(function() {
        update({ force: true });
        initUpdate();
      })
    });
  }

})(window.vendors);