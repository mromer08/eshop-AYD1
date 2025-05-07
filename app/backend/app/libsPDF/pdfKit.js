import { getOrderDetails } from '../controllers/billController.js'
import PDFDocument from 'pdfkit';

export async function buildPDF(orderID, dataCallback, endCallBack) {
    const doc = new PDFDocument();
    const order = await getOrderDetails(orderID);

    doc.on('data', dataCallback);
    doc.on('end', endCallBack);
    // Cabecera de la factura
    doc.fontSize(20).text('Factura de Compra', { align: 'center' });
    doc.moveDown();

    // Detalles de la orden
    doc.fontSize(12).text(`Número de Orden: ${order._id}`);
    doc.text(`Fecha de Orden: ${order.date.toDateString()}`);
    doc.text(`Usuario: ${order.user.name}`);
    doc.moveDown();

    doc.fontSize(16).text('Productos', { underline: true });
    doc.moveDown();

    order.products.forEach((item) => {
        doc.fontSize(12).text(`Producto: ${item.product.name}`);
        doc.text(`Cantidad: ${item.quantity}`);
        doc.text(`Precio Unitario: $${item.product.price}`);
        doc.text(`Subtotal: $${item.product.price * item.quantity}`);
        doc.moveDown();
    });

    doc.fontSize(14).text(`Subtotal: $${order.subtotal}`);
    doc.text(`Costo de Envío: $${order.shipping_cost}`);
    doc.text(`Total: $${order.total}`);

    doc.end();
}