
export default function usePrint(styles: any) {
  console.log('adad')
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
              @page { margin: 30px; }
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
