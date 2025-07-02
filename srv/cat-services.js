const { cds2edm } = require("@sap/cds/libx/odata/utils")

module.exports = (srv) => {

    // srv.on('READ', 'Books', ()=> [
    //     { ID: 201, title: 'Ali tatilde', author_ID: 101, stock: 12 },
    //     { ID: 251, title: 'Veli okulda', author_ID: 150, stock: 333 },
    //     { ID: 252, title: 'Ayşe ip atlıyor', author_ID: 150, stock: 555 },
    //     { ID: 271, title: 'Fatma kitap okuyor', author_ID: 170, stock: 222 }
    // ])

    // srv.on('READ', 'Authors', ()=> [
    //     { ID: 101, name: 'Mücahid' },
    //     { ID: 150, name: 'Mustafa' },
    //     { ID: 170, name: 'Mehmet' }
    // ])


    const { Books } = cds.entities('my.bookshop');

    srv.before('CREATE', 'Orders', async (req) => {
        const order = req.data;
        if(!order.amount || order.amount <= 0) return req.error(400, 'Amount en az 1 olmalı');

        const tx = cds.transaction(req);
        const affectedRows = await tx.run(
            UPDATE (Books)
                .set({ stock: {'-=': order.amount}})
                .where({ stock: {'>=': order.amount}, ID: order.book_ID })
        );
        if(affectedRows === 0) req.error(409, "Stokta o kadar yok");
    });



}