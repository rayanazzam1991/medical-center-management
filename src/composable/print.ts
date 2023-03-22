import { ref } from 'vue';

function addStyles(win: any, styles: any) {
  styles.forEach((style: any) => {
    let link = win.document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", style);
    win.document.getElementsByTagName("head")[0].appendChild(link);
  });
}
export default function usePrintDiv(styles: any) {
  const printDiv = (divId: string) => {
    const div = document.getElementById(divId);
    if (div) {
      console.log("styles", styles)
      const printContent = div.innerHTML;
      const popupWin = window.open('', '_blank');
      popupWin?.document.open();
      popupWin?.document.write(`
        <html>
          <head>
            <title>Print Div</title>
            <style>
             ${styles}
            </style>
          </head>
          <body>
          <div 
            ${printContent}
          </body>
        </html>
      `);
      // addStyles(popupWin, styles)
      popupWin?.document.close();
      popupWin?.focus();
      popupWin?.print();
      popupWin?.close();
    }
  };

  return {
    printDiv,
  };
}