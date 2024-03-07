const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

// LINK PARA PEGAR MATÉRIAS
//const url = `https://repositorio.educacao.sp.gov.br/MidiasCMSP/ComponenteCurricular?IsMaterial=true&CodigoTipoEnsino=2&CodigoSerie=1`;

// LINK PARA PEGAR TIPO DE ENSINO (MEDIO OU FUNDAMENTAL)
//const url = `https://repositorio.educacao.sp.gov.br/MidiasCMSP/TipoEnsino?IsMaterial=true`;

async function coletarTipoEnsino() {
    try {
        
        // LINK PARA PEGAR TIPO DE ENSINO (MEDIO OU FUNDAMENTAL)
        const url = `https://repositorio.educacao.sp.gov.br/MidiasCMSP/TipoEnsino?IsMaterial=true`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json(); // ou response.text(), dependendo do tipo de resposta
            console.log(data);
            return data;
        } else {
            console.error('Erro na solicitação:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
    }
}

async function coletarMaterias(ensino, serie, bimestre) {
    try {
        
        // LINK PARA PEGAR MATÉRIAS
        const url = `https://repositorio.educacao.sp.gov.br/MidiasCMSP/ComponenteCurricular?IsMaterial=true&CodigoTipoEnsino=${ensino}&CodigoSerie=${serie}&CodigoBimestre=${bimestre}`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json(); // ou response.text(), dependendo do tipo de resposta
            console.log(data);
            return data;
        } else {
            console.error('Erro na solicitação:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
    }
}

async function coletarPDF(ensino, serie, materia, bimestre) {
  try {
    const browser = await puppeteer.launch({heandless: false});
    // HEADLESS = FALSE ( VISIVEL )
    // HEADLESS = TRUE ( INVISIVEL )

    const page = await browser.newPage();
    await page.goto(`https://repositorio.educacao.sp.gov.br/MidiasCMSP/BuscarMateriais?AnoLetivo=2024&CodigoTipoEnsino=${ensino}&CodigoSerie=${serie}&CodigoBimestre=${bimestre}&CodigoComponenteCurricular=${materia}&UserID=284769726&UserName=VITOR%20CUST%C3%93DIO%20DA%20SILVA&Login=00001110057556SP&PerfilTipo=Aluno&DescricaoPerfil=`);

    await page.waitForTimeout(5000);

    await page.waitForSelector('.item');

    // Usa page.$$eval() para obter todos os elementos com a classe 'item'
    const items = await page.$$eval('.item', items => {
      // Mapeia os elementos 'item' para extrair informações específicas
      return items.map(item => {
        const idAula = item.querySelector('.id-aula strong').textContent.trim();
        const tituloAula = item.querySelector('.titulo-aula').textContent.trim();

        // Extrai a URL do PDF da função onClick
        const onClickAttribute = item.querySelector('.btn-download').getAttribute('onclick');
        const pdfUrlMatch = onClickAttribute.match(/'([^']+)'/);
        const linkPDF = pdfUrlMatch ? pdfUrlMatch[1] : null;

        return {
          idAula,
          tituloAula,
          linkPDF,
        };
      });
    });

    // Log das informações coletadas
    await browser.close();
    return items;
  
  } catch (error) {
    console.error('Erro ao capturar o screenshot:', error);
    throw error;
  }
}

module.exports = { coletarPDF, coletarMaterias, coletarTipoEnsino };