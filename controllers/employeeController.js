const db = require("../models");
const Employee = db.Employee;

// GET ALL
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      name: req.body.name,
      email: req.body.email,
      designation: req.body.designation,
      salary: req.body.salary,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    await employee.update({
      name: req.body.name,
      email: req.body.email,
      designation: req.body.designation,
      salary: req.body.salary,
    });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    await employee.destroy();

    res.status(200).json({
      message: "Employee Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};