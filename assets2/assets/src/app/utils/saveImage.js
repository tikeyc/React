import $ from 'jquery';


export default function saveImage({
  height,
  fileName,
  target,
  showtarget,
  reportType,
  callback = () => {},
}) {
  if (reportType === 3) {
    $(target).show();
    $(showtarget).hide();
  } else if (reportType === 2) {
    $(target).removeClass('brand-popularity-track').addClass('brand-popularity-track-saveimg');
  }
  setTimeout(() => {
    window.html2canvas($(target), {
      allowTaint: false,
      taintTest: false,
      useCORS: false,
      height,
      onrendered(canvas) {
        const url = canvas.toDataURL();
        // 以下代码为下载此图片功能
        $(`<a href="${url}" download="${fileName}"></a>`)[0].click();
        if (reportType === 3) {
          $(target).hide();
          $(showtarget).show();
        } else if (reportType === 2) {
          $(target).removeClass('brand-popularity-track-saveimg').addClass('brand-popularity-track');
        }

        callback();
      },
    });
  }, 2000);
}
