// Grupa 2.13
// ilosc dostawców: 3
// ilośćodbiorców: 3
// aplikacja webowa
// interfejs: tak
// wizualizacja: tak
// blokowanie tras: nie

const SUPPLIERS_NUMBER = 3;
const RECIPIENTS_NUMBER = 3;

const button = document.getElementsByClassName("submit-button");

let demandArray = [];
let supplyArray = [];
let purchaseCostsArray = [];
let salesPricesArray = [];
let transportCostsArray = [[], [], []];

function calculateResult() {
    demandArray = [];
    purchaseCostsArray = [];
    supplyArray = [];
    salesPricesArray = [];
    transportCostsArray = [[], [], []];

    const demand = document.getElementsByClassName("demand")

    for (let i = 0; i < demand.length; i++) {
        if (!isNaN(parseInt(demand[i].value))) {
            demandArray.push(parseInt(demand[i].value));
        } else {
            alert(`Poprawnie uzupełnij podaż pole nr: ${i + 1}`);
        }
    }

    // console.log("Podaż:")
    // console.log(demandArray);

    const purchaseCosts = document.getElementsByClassName("purchase-cost");

    for (let i = 0; i < purchaseCosts.length; i++) {
        if (!isNaN(parseInt(purchaseCosts[i].value))) {
            purchaseCostsArray.push(parseInt(purchaseCosts[i].value));
        } else {
            alert(`Poprawnie uzupełnij koszt zakupu pole nr: ${i + 1}`);
        }
    }

    // console.log("Koszty zakupu: ")
    // console.log(purchaseCostsArray)

    const supply = document.getElementsByClassName("supply");

    for (let i = 0; i < supply.length; i++) {
        if (!isNaN(parseInt(supply[i].value))) {
            supplyArray.push(parseInt(supply[i].value));
        } else {
            alert(`Poprawnie uzupełnij popyt pole nr: ${i + 1}`);
        }
    }

    // console.log("Popyt:")
    // console.log(supplyArray)

    const salesPrices = document.getElementsByClassName("sales-prices")
    for (let i = 0; i < salesPrices.length; i++) {
        if (!isNaN(parseInt(salesPrices[i].value))) {
            salesPricesArray.push(parseInt(salesPrices[i].value));
        } else {
            alert(`Poprawnie uzupełnij koszt sprzedaży pole nr: ${i + 1}`);
        }
    }

    // console.log("Koszty sprzedaży:")
    // console.log(salesPricesArray);

    const transportCosts = document.getElementsByClassName("transport-costs");

    let counter = 0;
    while (counter < transportCosts.length) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                if (!isNaN(parseInt(transportCosts[counter].value))) {
                    transportCostsArray[i][j] = parseInt(transportCosts[counter].value);
                    counter++;
                } else {
                    alert(`Poprawnie uzupełnij koszt transportu pole nr: ${i + 1}, ${j + 1}`);
                    counter++;
                }
            }
        }
    }
    // console.log("Koszty transportu: ");
    // console.log(transportCostsArray)

    //-------------------------------------------------------------------------------------------

    function handleSum(total, number) {
        return total + number;
    }

    const totalDemand = demandArray.reduce(handleSum);
    const totalSupply = supplyArray.reduce(handleSum);

    if (totalDemand === totalSupply) {

        console.log("ZADANIE JEST ZBILANSOWANE!");

        const unitProfits = [[], [], []]; //tabela jednostkowych zysków

        let baseSolution = [[], [], []]; //rozwiązanie bazowe

        let z0 = 0; //zysk w pierwszej iteracji

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                unitProfits[i][j] = salesPricesArray[j] - purchaseCostsArray[i] - transportCostsArray[i][j];
            }
        }

        console.log("Tabela zysków jednostkowych: ");
        console.log(unitProfits);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                baseSolution[j][i] = Math.min(supplyArray[i], demandArray[j]);

                if (supplyArray[i] >= demandArray[j]) {
                    supplyArray[i] -= demandArray[j];
                    demandArray[j] = 0;
                } else {
                    demandArray[j] -= supplyArray[i];
                    supplyArray[i] = 0;
                }

                if (baseSolution[i][j] === undefined) {
                    baseSolution[i][j] = 0;
                }

                z0 += baseSolution[i][j] * unitProfits[i][j];
            }
        }

        console.log("z0: ");
        console.log(z0);

        let alfas = [0, null, null];
        let betas = [null, null, null];

        while (alfas.includes(null) || betas.includes(null)) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (alfas[i] != null && betas[j] == null) {
                        if (baseSolution[i][j] !== 0) {
                            betas[j] = unitProfits[i][j] - alfas[i];
                        }
                    } else if (alfas[i] == null && betas[j] != null) {
                        if (baseSolution[i][j] !== 0) {
                            alfas[i] = unitProfits[i][j] - betas[j];
                        }
                    }
                }
            }
        }

        console.log("Alfy: ");
        console.log(alfas);
        console.log("Bety: ");
        console.log(betas);

        let deltas = [[], [], []];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (baseSolution[i][j] !== 0) {
                    deltas[i][j] = null;
                } else {
                    deltas[i][j] = unitProfits[i][j] - alfas[i] - betas[j];
                }
            }
        }

        console.log("Delty: ")
        console.log(deltas);

        let max = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (max < deltas[i][j]) {
                    max = deltas[i][j];
                }
            }
        }

        let iteration = 1;

        while (max > 0) {

            console.log("max = " + max)

            let maxValue = 0;
            let isAbove = false;
            let x;
            let y;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (deltas[i][j] > maxValue) {
                        maxValue = deltas[i][j];
                        isAbove = true;
                        y = i;
                        x = j;
                    }
                }
            }

            let cykl1x = [];
            let cykl1y = [];
            let cykl2x = [];
            let cykl2y = [];

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (deltas[i][j] === null && y === i) {
                        cykl1x.push(j);
                        cykl1y.push(i);
                    }
                    if (deltas[i][j] === null && x === j) {
                        cykl2x.push(j);
                        cykl2y.push(i);
                    }
                }
            }

            let tabP = [];
            let tabQ = [];

            for (let i = 0; i < cykl1x.length; i++) {
                for (let j = 0; j < cykl2x.length; j++) {

                    if (deltas[cykl2y[j]][cykl1x[i]] == null) {
                        tabP.push(x);
                        tabQ.push(y);
                        tabP.push(cykl2x[j]);
                        tabQ.push(cykl2y[j]);
                        tabP.push(cykl2y[j]);
                        tabQ.push(cykl1x[i]);
                        tabP.push(cykl1x[i]);
                        tabQ.push(cykl1y[i]);
                    }

                }
            }

            let index1 = tabQ[1];
            let index2 = tabP[1];
            let index3 = tabQ[3];
            let index4 = tabP[3];

            let tempik;
            if (baseSolution[index1][index2] < baseSolution[index3][index4]) {
                tempik = baseSolution[index1][index2];
            } else {
                tempik = baseSolution[index3][index4];
            }

            for (let i = 0; i < 4; i++) {
                let in1 = tabQ[i];
                let in2 = tabP[i];

                if (i === 0){
                    baseSolution[in1][in2] += tempik;
                }
                if (i === 1){
                    baseSolution[in1][in2] -= tempik;
                }
                if (i === 2){
                    baseSolution[in1][in2] += tempik;
                }
                if (i === 3){
                    baseSolution[in1][in2] -= tempik;
                }
            }

            alfas = [0, null, null];
            betas = [null, null, null];

            while (alfas.includes(null) || betas.includes(null)) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (alfas[i] != null && betas[j] == null) {
                            if (baseSolution[i][j] !== 0) {
                                betas[j] = unitProfits[i][j] - alfas[i];
                            }
                        } else if (alfas[i] == null && betas[j] != null) {
                            if (baseSolution[i][j] !== 0) {
                                alfas[i] = unitProfits[i][j] - betas[j];
                            }
                        }
                    }
                }
            }

            deltas = [[], [], []];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (baseSolution[i][j] !== 0) {
                        deltas[i][j] = null;
                    } else {
                        deltas[i][j] = unitProfits[i][j] - alfas[i] - betas[j];
                    }
                }
            }

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (max > deltas[i][j]) {
                        max = deltas[i][j];
                    }
                }
            }

            let z = 0;
            //liczenie nowych zysków
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    z += baseSolution[i][j] * unitProfits[i][j];
                }
            }

            console.log("Iteracja nr: ");
            console.log(iteration);
            console.log(`Optymalne przewozy`)
            console.log(baseSolution)
            console.log("Alfy")
            console.log(alfas)
            console.log("Bety")
            console.log(betas)
            console.log("Współczynniki optymalności")
            console.log(deltas);
            console.log("Zyski")
            console.log(z);
            ++iteration;
        }

    } else {

        console.log("ZADANIE NIE JEST ZBILANSOWANE!");

        const fejkowyDostawca = supplyArray.reduce(handleSum);
        const fejkowyOdbiorca = demandArray.reduce(handleSum);

        demandArray.push(fejkowyDostawca);
        supplyArray.push(fejkowyOdbiorca);

        console.log("FD: ")
        console.log(demandArray)

        console.log("FO:")
        console.log(supplyArray)

        const unitProfits = [[], [], [], []]; //tabela jednostkowych zysków

        const baseSolution = [[], [], [], []]; //rozwiązanie bazowe

        let z0 = 0; //zysk w pierwszej iteracji

        for (let i = 0; i < SUPPLIERS_NUMBER; i++) {

            for (let j = 0; j < RECIPIENTS_NUMBER; j++) {

                unitProfits[i][j] = salesPricesArray[j] - purchaseCostsArray[i] - transportCostsArray[i][j];

            }
        }

        unitProfits[0][3] = 0;
        unitProfits[1][3] = 0;
        unitProfits[2][3] = 0;
        unitProfits[3][0] = 0;
        unitProfits[3][1] = 0;
        unitProfits[3][2] = 0;
        unitProfits[3][3] = 0;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                baseSolution[j][i] = Math.min(supplyArray[i], demandArray[j]);

                if (supplyArray[i] >= demandArray[j]) {
                    supplyArray[i] -= demandArray[j];
                    demandArray[j] = 0;
                } else {
                    demandArray[j] -= supplyArray[i];
                    supplyArray[i] = 0;
                }

                if (baseSolution[i][j] === undefined) {
                    baseSolution[i][j] = 0;
                }
                z0 += baseSolution[i][j] * unitProfits[i][j];

            }

        }

        console.log("Rozwiązanie bazowe: ");
        console.log(baseSolution);
        console.log("Tabela jednostkowych zysków: ");
        console.log(unitProfits);
        console.log("Zysk w pierwszej iteracji: ");
        console.log(z0);

        let alfas = [0, null, null, null];
        let betas = [null, null, null, null];

        while (alfas.includes(null) || betas.includes(null)) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (alfas[i] != null && betas[j] == null) {
                        if (baseSolution[i][j] !== 0) {
                            betas[j] = unitProfits[i][j] - alfas[i];
                        }
                    } else if (alfas[i] == null && betas[j] != null) {
                        if (baseSolution[i][j] !== 0) {
                            alfas[i] = unitProfits[i][j] - betas[j];
                        }
                    }
                }
            }
        }

        console.log("Alfy: ");
        console.log(alfas);
        console.log("Bety: ");
        console.log(betas);

        let deltas = [[], [], [], []];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                if (baseSolution[i][j] != 0) {
                    deltas[i][j] = null;
                } else {
                    // console.log("deltas[i][j]" + i + ", " + j + " = unitProfits[i][j]: " + unitProfits[i][j]+ " - alfas[i]: " +alfas[i] + " - betas[j]: " + betas[j])
                    deltas[i][j] = unitProfits[i][j] - alfas[i] - betas[j];
                }

            }
        }

        console.log("Delty: ")
        console.log(deltas);

        let max = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (max < deltas[i][j]) {
                    max = deltas[i][j];
                }
            }
        }

        let iteration = 1;

        while (max > 0) {

            let maxValue = 0;
            let isAbove = false;
            let x = 0;
            let y = 0;

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (deltas[i][j] > maxValue) {
                        maxValue = deltas[i][j];
                        isAbove = true;
                        y = i;
                        x = j;
                    }
                }
            }

            console.log("x: " + x)
            console.log("y: " + y)

            // let cykl1x = [];
            // let cykl1y = [];
            // let cykl2x = [];
            // let cykl2y = [];
            //
            // for (let i = 0; i < 4; i++) {
            //     for (let j = 0; j < 4; j++) {
            //         if (deltas[i][j] === null && y === i) {
            //             cykl1x.push(j);
            //             cykl1y.push(i);
            //         }
            //         if (deltas[i][j] === null && x === j) {
            //             cykl2x.push(j);
            //             cykl2y.push(i);
            //         }
            //
            //     }
            // }
            //
            // let tabP = [];
            // let tabQ = [];
            //
            // for (let i = 0; i < cykl1x.length; i++) {
            //     for (let j = 0; j < cykl2x.length; j++) {
            //         if (deltas[cykl2y[j]][cykl1x[i]]) {
            //             tabP.push(x);
            //             tabQ.push(y);
            //             tabP.push(cykl2x[j]);
            //             tabQ.push(cykl2y[j]);
            //             tabP.push(cykl2y[j]);
            //             tabQ.push(cykl1x[i]);
            //             tabP.push(cykl1x[i]);
            //             tabQ.push(cykl1y[i]);
            //         }
            //     }
            // }
            //
            // console.log("czemuż nie wypisujesz")
            // console.log("ppp")
            // console.log(tabP);
            // console.log("qqq")
            // console.log(tabQ)
            //
            // if(tabP.length === 0 && tabQ.length === 0){
            //     console.log("break!")
            //     break;
            // }


            // let index1 = tabQ[1];
            // let index2 = tabP[1];
            // let index3 = tabQ[3];
            // let index4 = tabP[3];
            //
            // let tempik;
            // if (baseSolution[index1][index2] < baseSolution[index3][index4]) {
            //     tempik = baseSolution[index1][index2];
            // } else {
            //     tempik = baseSolution[index3][index4];
            // }
            //
            // for (let i = 0; i < 4; i++) {
            //     let in1 = tabQ[i];
            //     let in2 = tabP[i];
            //
            //     if (i === 0){
            //         baseSolution[in1][in2] += tempik;
            //     }
            //     if (i === 1){
            //         baseSolution[in1][in2] -= tempik;
            //     }
            //     if (i === 2){
            //         baseSolution[in1][in2] += tempik;
            //     }
            //     if (i === 3){
            //         baseSolution[in1][in2] -= tempik;
            //     }
            // }


            //-------------------------------------------------------------

            class Punkt {
                constructor(x,y) {
                    this.x = x;
                    this.y = y;
                }
            }

            let punktPoziom = [];
            let punktPion = [];
            let cykl = [];

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (deltas[i][j] === null && y === i) {
                       const nowyPunkt = new Punkt(i,j);
                       punktPion.push(nowyPunkt);
                    }
                    if (deltas[i][j] === null && x === j) {
                        const nowyPunkt = new Punkt(i,j);
                        punktPoziom.push(nowyPunkt);
                    }
                }
            }

            for (let i = 0; i < punktPoziom.length; i++) {
                for (let j = 0; j < 4; j++) {

                    if(deltas[punktPoziom[i].x][j] === null && j !== punktPoziom[i].y){

                        let punkt1 = new Punkt(x, y);
                        let punkt2 = new Punkt(punktPoziom[i].x, j);

                        cykl.push(punkt1);
                        cykl.push(punktPoziom[i]);
                        cykl.push(punkt2);
                        cykl.push(punktPion[0]);

                        break;
                    }
                }
                if(cykl.length === 4){
                    break;
                }
            }

            alfas = [0, null, null, null];
            betas = [null, null, null, null];

            while (alfas.includes(null) || betas.includes(null)){
                for(let i = 0; i < 4; i++){
                    for(let j = 0; j < 4; j++) {
                        if(alfas[i] != null && betas[j] == null){
                            if(baseSolution[i][j] !== 0){
                                betas[j] = unitProfits[i][j] - alfas[i];
                            }
                        } else if(alfas[i] == null && betas[j] != null){
                            if(baseSolution[i][j] !== 0){
                                alfas[i] = unitProfits[i][j] - betas[j];
                            }
                        }
                    }
                }
            }

            console.log("nowe alfy")
            console.log(alfas)
            console.log("nowe bety")
            console.log(betas)

            //deltas
            deltas = [[],[],[],[]];
            for(let i = 0; i < 4; i++){
                for(let j = 0; j < 4; j++) {
                    if(baseSolution[i][j] !== 0){
                        deltas[i][j] = null;
                    } else {
                        deltas[i][j] = unitProfits[i][j] - alfas[i] - betas[j];
                    }
                }
            }

            max = 0;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (max < deltas[i][j]) {
                        max = deltas[i][j];
                    }
                }
            }

            let z = 0;
            //liczenie nowych zysków
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    z += baseSolution[i][j] * unitProfits[i][j];
                }
            }

            console.log(`Iteracja nr: ${iteration}`);
            console.log(`Optymalne przewozy`)
            console.log(baseSolution)
            console.log("Alfy")
            console.log(alfas)
            console.log("Bety")
            console.log(betas)
            console.log("Współczynnik optymalności")
            console.log(deltas);
            ++iteration;
            console.log("Zyski")
            console.log(z);
        }

        //Zystki jednostkowe
        let profitTableWrapper = document.getElementById("profitTableWrapper");

        let profitTableTitle = document.createElement("h3");
        profitTableTitle.textContent = "Zyski jednostkowe";
        profitTableWrapper.append(profitTableTitle);

        let table1 = document.createElement('TABLE');

        let profitTableBody = document.createElement('TBODY');
        table1.appendChild(profitTableBody);

        for (let i = 0; i < unitProfits.length; i++) {

            let tr = document.createElement('TR');
            tr.classList.add("row");
            profitTableBody.appendChild(tr);

            for (let j = 0; j < unitProfits[0].length; j++) {

                let td = document.createElement('TD');
                td.classList.add("profit");
                td.appendChild(document.createTextNode(unitProfits[i][j]));
                tr.appendChild(td);
            }
        }
        profitTableWrapper.appendChild(table1);

        //Optymalne przewozy
        let optimalTransportTableWrapper = document.getElementById("optimalTransportTableWrapper");

        let optimalTransportTableTitle = document.createElement("h3");
        optimalTransportTableTitle.textContent = "Optymalne przewozy";
        optimalTransportTableWrapper.append(optimalTransportTableTitle);

        let table2 = document.createElement('TABLE');

        let optimalTransportTableBody = document.createElement('TBODY');
        table2.appendChild(optimalTransportTableBody);

        for (let i = 0; i < baseSolution.length; i++) {

            let tr = document.createElement('TR');
            tr.classList.add("row");
            optimalTransportTableBody.appendChild(tr);

            for (let j = 0; j < baseSolution[0].length; j++) {
                let td = document.createElement('TD');
                td.classList.add("optimal-transport");
                td.appendChild(document.createTextNode(baseSolution[i][j]));
                tr.appendChild(td);
            }
        }
        optimalTransportTableWrapper.appendChild(table2);

        let kosztTransportu = 0;
        let zakup = 0;
        let kosztCalkowity = 0;
        let przychod = 0;
        let zysk = 0;

        console.log("Koszty zakupu")
        console.log(purchaseCostsArray)

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                zakup += purchaseCostsArray[i] * baseSolution[i][j];
                kosztTransportu += transportCostsArray[i][j] * baseSolution[i][j];
                przychod += salesPricesArray[j] * baseSolution[i][j];
            }
        }

        console.log("zakup: " + zakup)
        console.log("koszty transportu: " + kosztTransportu)
        console.log("przychod: " + przychod)

        kosztCalkowity = zakup + kosztTransportu;
        zysk = przychod - kosztCalkowity;

        console.log("koszt całkowity: " + kosztCalkowity)
        console.log("zysk: " + zysk)


        let resultWrapper = document.querySelector(".resultWrapper");

        let transportCost = document.createElement("h4");
        transportCost.textContent = "Koszty transportu: " + kosztTransportu

        let purchaseCost = document.createElement("h4");
        purchaseCost.textContent = "Koszty zakupu: " + zakup

        let totalCost = document.createElement("h4");
        totalCost.textContent = "Koszt całkowity: " + kosztCalkowity;

        let income = document.createElement("h4");
        income.textContent = "Przychód: " + przychod;

        let profit = document.createElement("h4");
        profit.textContent = "Zysk: " + zysk;

        resultWrapper.append(purchaseCost);
        resultWrapper.append(transportCost);
        resultWrapper.append(totalCost);
        resultWrapper.append(income);
        resultWrapper.append(profit);

    }

}

button[0].addEventListener("click", calculateResult);


