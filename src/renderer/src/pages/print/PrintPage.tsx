import styles from "./Print.module.scss";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { IProductLabel } from "@/utils/interfaces/ProductLabel";
import LabelHelper from "@/utils/helpers/LabelHelper";

const PrintPage = () => {
  const [result, setResult] = useState<IProductLabel | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer.on("print-label", (_, data: IProductLabel) => {
      setResult(data);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("print-label");
    };
  }, []);

  const image = `data:image/png;base64, ${result?.image}`;

  if (result == null) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{result.title}</h1>
        <span>{LabelHelper.badStringToGood(result.stockName ?? "")}</span>
        <div className={styles.headerBarcode}>
          {/* stokKodu + yapKod */}
          <div className={styles.barcodeAndType}>
            <Barcode
              value={result.title}
              displayValue={false}
              width={1}
              height={35}
            />
            <div className={styles.productionType}>
              <h1>{result.productType}</h1>
            </div>
          </div>

          <div className={styles.qrLot}>
            <QRCode value={result.lotNo} size={64} />
          </div>
        </div>
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Bottom</th>
              <th>Top</th>
              <th>Assembly</th>
              <th>Logo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Code</td>
              <td>{LabelHelper.emptyCharacter(result.bodyDetail.stockCode)}</td>
              <td>{LabelHelper.emptyCharacter(result.topDetail.stockCode)}</td>
              <td>
                {LabelHelper.emptyCharacter(result.assemblyDetail.stockCode)}
              </td>
              <td>{LabelHelper.emptyCharacter(result.logoDetail.stockCode)}</td>
            </tr>
            <tr>
              <td>Color</td>
              <td>{LabelHelper.emptyCharacter(result.bodyDetail.color)}</td>
              <td>{LabelHelper.emptyCharacter(result.topDetail.color)}</td>
              <td>{LabelHelper.emptyCharacter(result.assemblyDetail.color)}</td>
              <td>{LabelHelper.emptyCharacter(result.logoDetail.color)}</td>
            </tr>
            <tr className={styles.date}>
              <td>Date</td>
              <td>{LabelHelper.isEmpty(result.bodyDetail.date)}</td>
              <td>{LabelHelper.isEmpty(result.topDetail.date)}</td>
              <td>{LabelHelper.isEmpty(result.assemblyDetail.date)}</td>
              <td>{LabelHelper.isEmpty(result.logoDetail.date)}</td>
            </tr>
            <tr className={styles.date}>
              <td>Time</td>
              <td>{LabelHelper.isEmpty(result.bodyDetail.time)}</td>
              <td>{LabelHelper.isEmpty(result.topDetail.time)}</td>
              <td>{LabelHelper.isEmpty(result.assemblyDetail.time)}</td>
              <td>{LabelHelper.isEmpty(result.logoDetail.time)}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.tableFooter}>
          <ul>
            <li>
              <h1>Quantity</h1>
              <span>{result.quantity}</span>

              <h1 className={styles.gross}>Gross Weight</h1>
              <span>{result.grossWeight}</span>
              <span></span>
            </li>
            <li>
              <h1>Seal</h1>
              <span className={styles.sealSpan}>{result.sealType}</span>
            </li>
          </ul>
        </div>

        <div className={styles.footer}>
          <div className={styles.serial}>
            <h1>Lot No: {result.lotNo}</h1>
            <h1>
              Seri No: {result.serialNo.toUpperCase().replaceAll("İ", "I")}
            </h1>
          </div>

          <div className={styles.wrapper}>
            <div className={styles.column}>
              <img src={image} />

              <Barcode
                value={result.serialNo.toUpperCase().replaceAll("İ", "I")}
                displayValue={false}
                width={1.5}
                height={50}
                margin={0}
              />
            </div>

            <Barcode
              value={result.serialNo.toUpperCase().replaceAll("İ", "I")}
              displayValue={false}
              width={1.5}
              height={50}
              margin={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
