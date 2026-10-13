/* eslint-disable no-unused-vars */

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const outputDate = date.toLocaleDateString('en-US', options);
  return outputDate;
};

const roundToDecimalIfNeeded = (val) => {
  const numVal = parseFloat(val);
  if (Number.isInteger(numVal)) {
    return numVal.toString();
  } else {
    return numVal.toFixed(1);
  }
};

const colorMap = new Map([
  [0.0, '#db2400'],
  [1.0, '#dc4300'],
  [2.0, '#da5b00'],
  [3.0, '#d57100'],
  [4.0, '#cd8600'],
  [5.0, '#c19900'],
  [6.0, '#b2ac00'],
  [7.0, '#9fbe00'],
  [8.0, '#86ce00'],
  [9.0, '#62df00'],
  [10.0, '#00ee00']
]);

let oTryTimer = null,
  svgElement = null;

function addClassToSvgGauge(svgId, voteValue) {
  addClassToSvgGaugeTry(svgId, voteValue, 0);
}

function addClassToSvgGaugeTry(svgId, voteValue, tryCount) {/*
  console.log('svgId: ' + svgId + ', voteValue: ' + voteValue + ', tryCount: ' + tryCount); */
  if (tryCount > 10) {
    if (svgElement) {
      svgElement.remove();
    }
    if (oTryTimer) window.clearTimeout(oTryTimer);
    return;
  }
  try {
    const $ = jQuery;
    svgElement          = document.getElementById(svgId);
    const svgDoc        = svgElement.contentDocument;
    const svgEl         = svgDoc.getElementById('gaugeSvg');
    const colorDim      = '#555555';
    const colorFill     = '#333333';
    const colorVal      = colorMap.get(Math.floor(voteValue));
    const $borderFill   = $(svgEl).find('#borderFill');
    const $borderVal    = $(svgEl).find('#borderVal');
    const $percentVal   = $(svgEl).find('#percentVal');
    const maxGaugeValue = 490.0;
    let decimalPercent  = 0.0;
    let wantedValue     = 0.0;
    const percentValue = voteValue * 10.0;

    if (null !== svgEl && null !== decimalPercent) {
      decimalPercent = percentValue / 100.0;
      wantedValue = maxGaugeValue - decimalPercent * maxGaugeValue;
      $borderFill.attr('stroke', colorFill);
      $borderVal.attr('stroke', colorVal);
      $percentVal.html(roundToDecimalIfNeeded(voteValue));
    } else {
      wantedValue = maxGaugeValue / 2;
      $borderFill.add($borderVal).attr('stroke', colorDim);
      $percentVal.html('-');
    }
    $borderVal.attr('stroke-dashoffset', wantedValue);
  } catch (err) {
    console.error(err);
    if (tryCount > 6) {
      voteValue = 0;
    }
    if (!svgId) {
      return;
    }
    oTryTimer = window.setTimeout(() => {
      addClassToSvgGaugeTry(svgId, voteValue, tryCount + 1);
    }, 100);
  }
}


jQuery(document).ready(($) => {
  const setHeaderSidesWidth = () => {
    const $headerL = $('#headerLeft');
    const $headerR = $('#headerRight');
    if ($headerL.length && $headerR.length) {
      $headerL.width($headerR.width());
    }
  };
  window.setTimeout(setHeaderSidesWidth, 100);
  $(window).on('resize', setHeaderSidesWidth);
});
