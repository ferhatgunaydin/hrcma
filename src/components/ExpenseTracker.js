// src/components/ExpenseTracker.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const ExpenseTracker = () => {
    const [people, setPeople] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [personName, setPersonName] = useState("");
    const [selectedPerson, setSelectedPerson] = useState("");
    const [expenseType, setExpenseType] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");

    useEffect(() => {
        const unsubscribePeople = onSnapshot(collection(db, "people"), (snapshot) => {
            setPeople(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubscribeExpenses = onSnapshot(collection(db, "expenses"), (snapshot) => {
            setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribePeople();
            unsubscribeExpenses();
        };
    }, []);

    const addPerson = async () => {
        if (personName) {
            await addDoc(collection(db, "people"), { name: personName });
            setPersonName("");
        }
    };

    const removePerson = async (id) => {
        await deleteDoc(doc(db, "people", id));
    };

    const addExpense = async () => {
        if (expenseType && amount && date && selectedPerson) {
            await addDoc(collection(db, "expenses"), { type: expenseType, amount, date, person: selectedPerson });
            setExpenseType("");
            setAmount(0);
            setDate("");
            setSelectedPerson("");
        }
    };

    const deleteExpense = async (id) => {
        await deleteDoc(doc(db, "expenses", id));
    };

    const deleteAllExpensesByPerson = async (person) => {
        const personExpenses = expenses.filter(exp => exp.person === person);
        for (const expense of personExpenses) {
            await deleteDoc(doc(db, "expenses", expense.id));
        }
    };

    const getTotalByPerson = (person) => {
        return expenses
            .filter(exp => exp.person === person.name)
            .reduce((sum, exp) => sum + exp.amount, 0);
    };

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Harcama Takip Uygulaması</h1>
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Kişi Ekle</h2>
                    <div className="input-group mb-3">
                        <input
                            className="form-control"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            placeholder="Kişi Adı"
                        />
                        <button className="btn btn-primary" onClick={addPerson}>Ekle</button>
                    </div>
                </div>
            </div>
            <h2>Kişiler</h2>
            {people.map(person => (
                <div key={person.id} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{person.name}</h5>
                        <button className="btn btn-danger" onClick={() => removePerson(person.id)}>Kişi Sil</button>
                        <button className="btn btn-warning" onClick={() => deleteAllExpensesByPerson(person.name)}>Tüm Harcamaları Sil</button>
                        <h6 className="mt-3">{person.name} için Harcamalar</h6>
                        {expenses
                            .filter(exp => exp.person === person.name)
                            .map(exp => (
                                <div key={exp.id} className="d-flex justify-content-between align-items-center">
                                    <span>{exp.type}: {exp.amount} ₺ {formatDate(exp.date)} tarihinde</span>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteExpense(exp.id)}>Sil</button>
                                </div>
                            ))}
                        <strong>Toplam: {getTotalByPerson(person)} ₺</strong>
                    </div>
                </div>
            ))}
            <h2>Harcama Ekle</h2>
            <div className="row mb-4">
                <div className="col-md-4">
                    <select className="form-select mb-3" value={selectedPerson} onChange={(e) => setSelectedPerson(e.target.value)}>
                        <option value="" disabled>Kişi Seçin</option>
                        {people.map(person => (
                            <option key={person.id} value={person.name}>{person.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <input className="form-control mb-3" value={expenseType} onChange={(e) => setExpenseType(e.target.value)} placeholder="Harcama Türü" />
                </div>
                <div className="col-md-4">
                    <input className="form-control mb-3" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Tutar" />
                </div>
                <div className="col-md-4">
                    <input className="form-control mb-3" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="col-md-4">
                    <button className="btn btn-success" onClick={addExpense}>Harcama Ekle</button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;