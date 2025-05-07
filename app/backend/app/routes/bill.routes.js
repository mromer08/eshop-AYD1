import express from 'express';
import { buildPDF } from '../libsPDF/pdfKit.js';

const router = express.Router();

router.get('/:orderID', (req, res) => {
    const { orderID } = req.params;
    res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename: bill.pdf",
    });

    buildPDF(orderID,
        (data) => res.write(data),
        () => res.end()
    );
});

export default router;