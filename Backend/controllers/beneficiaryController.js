const Beneficiary = require('../models/Beneficiary');

exports.createBeneficiary = async (req, res) => {
    const { name, lastname, address, Age, gouvernorat, email, password, phoneNumber, children } = req.body;

    try {
        // Check if beneficiary exists
        const existingBeneficiary = await Beneficiary.findOne({ email });
        if (existingBeneficiary) {
            return res.status(400).json({ 
                status: 'fail',
                message: 'A beneficiary with this email already exists' 
            });
        }

        // Create new beneficiary
        const newBeneficiary = await Beneficiary.create({
            name,
            lastname,
            address,
            Age,
            gouvernorat,
            email,
            password,
            phoneNumber,
            children: children || []
        });

        // Remove password from output
        newBeneficiary.password = undefined;

        res.status(201).json({
            status: 'success',
            data: {
                beneficiary: newBeneficiary
            }
        });

    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Error creating beneficiary',
            error: error.message 
        });
    }
};

exports.getAllBeneficiaries = async (req, res) => {
    try{
        const beneficiaries = await Beneficiary.find().select('-password');

        res.status(200).json({
            status: 'success',
            results: beneficiaries.length,
            data: {
                beneficiaries
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching beneficiaries',
            error: error.message
        });
    }
}

exports.getBeneficiaryById = async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findById(req.params.id).select('-password');
        if (!beneficiary) {
            return res.status(404).json({
                status: 'fail',
                message: 'Beneficiary not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                beneficiary
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching beneficiary',
            error: error.message
        });
    }
}

exports.updateBeneficiary = async (req, res) => {
    try {
        
        const { id } = req.params;
        
        // 2. Filter out restricted fields (password and email)
        const filteredBody = { ...req.body };
        const excludedFields = ['password'];
        excludedFields.forEach(field => delete filteredBody[field]);
        
        // 3. Special handling for children array if provided
        if (req.body.children) {
            filteredBody.children = req.body.children;
        }
        
        // 4. Find and update the beneficiary
        const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
            id,
            filteredBody,
            {
                new: true,              // Return the updated document
            }
        ).select('-password');        
        
        
        if (!updatedBeneficiary) {
            return res.status(404).json({
                status: 'fail',
                message: 'No beneficiary found with that ID'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                beneficiary: updatedBeneficiary
            }
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating beneficiary',
            error: error.message
        });
    }
};  

exports.deleteBeneficiary = async (req, res) => {
    try {
        // 1. Récupérer l'ID du bénéficiaire
        const { id } = req.params;

        // 2. Vérifier si le bénéficiaire existe
        const beneficiary = await Beneficiary.findById(id);
        if (!beneficiary) {
            return res.status(404).json({
                status: 'fail',
                message: 'Aucun bénéficiaire trouvé avec cet ID'
            });
        }

        // 3. Supprimer le bénéficiaire
        await Beneficiary.findByIdAndDelete(id);

        // 4. Réponse de succès
        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression du bénéficiaire',
            error: error.message
        });
    }
};