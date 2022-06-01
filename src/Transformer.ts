function satelliteAnalyzer(holyBread: string): string {
  return holyBread.length + "\n";
}

function Transformer(inputJs: any) {
  var outputJs = "";

  // Iterating over every LoC
  var lines = inputJs.split(/\r\n|\n/);
  for (var line = 0; line < lines.length - 1; line++) {
    const cookedPorkchop = satelliteAnalyzer(lines[line]);

    outputJs += cookedPorkchop;
  }

  return outputJs;
}

export default Transformer;
