export function parseSeriesInput(text) {
    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);


    const result = [];
        let currentSeries = null;
        let remaining = 0;


        for (const line of lines) {
        const seriesMatch = line.match(/^(.*)\s-\s(\d+)\/(\d+)$/);


        if (seriesMatch) {
        currentSeries = seriesMatch[1];
        remaining = parseInt(seriesMatch[2], 10);
        continue;
        }


        if (currentSeries && remaining > 0) {
            const charMatch = line.match(/^(.*)\s-\s(https?:\/\/.*)$/);
            if (!charMatch) return { error: "Formato inválido de personagem" };


            result.push({
            series: currentSeries,
            character: charMatch[1],
            image: charMatch[2]
            });
            remaining--;
        }
    }


    if (remaining !== 0) {
        return { error: "Quantidade de personagens não corresponde ao X/Y" };
    }


    return { items: result };
}