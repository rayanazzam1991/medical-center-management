// function addStyles(win: any, styles: any) {
//     styles.forEach((style: any) => {
//         let link = win.document.createElement("link");
//         link.setAttribute("rel", "stylesheet");
//         link.setAttribute("type", "text/css");
//         link.setAttribute("href", style);
//         win.document.getElementsByTagName("head")[0].appendChild(link);
//     });
// }

export default function usePrint(styles: any) {
  const printDiv = (divId: string, title: string) => {
    const div = document.getElementById(divId);
    if (div) {
      const printContent = div.innerHTML;
      const popupWin = window.open(title, '_blank');
      popupWin?.document.open();
      popupWin?.document.write(`
          <html>
            <head></title>
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