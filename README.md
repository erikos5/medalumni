# Mediterranean College Alumni Platform

Εφαρμογή διαδικτύου για την υποστήριξη της ιστοσελίδας του Mediterranean College και ειδικά του γραφείου αποφοίτων.

## Περιγραφή

Η εφαρμογή επιτρέπει την εγγραφή των αποφοίτων του Mediterranean College και την υποβολή και επεξεργασία των προσωπικών τους προφίλ. Τα προφίλ ομαδοποιούνται ανά σχολή του Mediterranean College. Τα δικαιώματα πρόσβασης χορηγούνται στους χρήστες σύμφωνα με 3 επίπεδα: Διαχειριστής, Εγγεγραμμένος Απόφοιτος, Αιτούμενος Απόφοιτος και Επισκέπτης.

## Τεχνολογίες

Η εφαρμογή αναπτύχθηκε με:

### Backend
- Node.js
- Express.js
- MongoDB με Mongoose
- JWT για αυθεντικοποίηση

### Frontend
- React
- React Router για πλοήγηση
- Context API για διαχείριση καταστάσεων
- Axios για HTTP αιτήματα

## Εγκατάσταση

1. Κλωνοποιήστε το repository
```
git clone https://github.com/yourusername/mediterranean-alumni.git
cd mediterranean-alumni
```

2. Εγκαταστήστε τα dependencies για το backend
```
npm install
```

3. Εγκαταστήστε τα dependencies για το frontend
```
cd client
npm install
```

4. Δημιουργήστε ένα αρχείο .env στην κύρια διαδρομή με τις ακόλουθες μεταβλητές:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mediterranean-alumni
JWT_SECRET=your_jwt_secret
```

## Εκτέλεση

### Ανάπτυξη
Για να τρέξετε την εφαρμογή σε περιβάλλον ανάπτυξης (και το frontend και το backend):
```
npm run dev
```

Για να τρέξετε μόνο το backend:
```
npm run server
```

Για να τρέξετε μόνο το frontend:
```
npm run client
```

### Παραγωγή
Για να χτίσετε το frontend για παραγωγή:
```
cd client
npm run build
```

Για να τρέξετε την εφαρμογή σε περιβάλλον παραγωγής:
```
npm start
```

## Δομή του Project

```
mediterranean-alumni/
├── client/                 # React frontend
│   ├── public/             # Στατικά αρχεία
│   └── src/                # Πηγαίος κώδικας React
│       ├── components/     # React components
│       ├── context/        # Context API
│       └── utils/          # Βοηθητικές συναρτήσεις
├── config/                 # Ρυθμίσεις για το backend
├── middleware/             # Express middleware
├── models/                 # Mongoose μοντέλα
├── routes/                 # Express routes
│   └── api/                # API endpoints
├── uploads/                # Μεταφορτωμένα αρχεία
├── .env                    # Μεταβλητές περιβάλλοντος
├── .gitignore              # Αρχεία που αγνοούνται από το Git
├── package.json            # Dependencies backend
└── server.js               # Κύριο αρχείο Express
```

## Λειτουργίες

- Εγγραφή και σύνδεση χρηστών
- Δημιουργία και επεξεργασία προφίλ αποφοίτων
- Διαχείριση σχολών (για διαχειριστές)
- Έγκριση αιτήσεων εγγραφής (για διαχειριστές)
- Προβολή καταλόγου αποφοίτων με φίλτρα
- Προβολή λεπτομερών προφίλ αποφοίτων

## Συνεισφορά

Για να συνεισφέρετε σε αυτό το project, ακολουθήστε τα εξής βήματα:

1. Κάντε fork του repository
2. Δημιουργήστε ένα branch για τη λειτουργία σας (`git checkout -b feature/amazing-feature`)
3. Κάντε commit τις αλλαγές σας (`git commit -m 'Add some amazing feature'`)
4. Κάντε push στο branch (`git push origin feature/amazing-feature`)
5. Ανοίξτε ένα Pull Request 