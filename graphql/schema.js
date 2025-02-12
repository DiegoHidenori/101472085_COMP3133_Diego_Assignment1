const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLFloat, GraphQLNonNull } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        id: { type: GraphQLID },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        designation: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        date_of_joining: { type: GraphQLString },
        department: { type: GraphQLString },
        employee_photo: { type: GraphQLString }
    })
});

const AuthPayloadType = new GraphQLObjectType({
    name: "AuthPayload",
    fields: {
        user: { type: UserType },
        token: { type: GraphQLString }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: AuthPayloadType,
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(_, args) {
                const user = await User.findOne({ 
                    $or: [
                        { username: args.username }, 
                        { email: args.email }
                    ] 
                });
                console.log('User found:', user);
                
                if (!user) throw new Error('User not found');
                console.log('Comparing password:', args.password);
                console.log('Stored hash:', user.password);
                
                const isMatch = await bcrypt.compare(args.password, user.password);
                console.log('Password match result:', isMatch);
                
                if (!isMatch) throw new Error('Invalid credentials');
                
                const token = jwt.sign({ userId: user.id }, 'mysecretkey', { expiresIn: '1h' });
                return { user, token };
            }
        },
        employees: {
            type: new GraphQLList(EmployeeType),
            async resolve() {
                return await Employee.find();
            }
        },
        employee: {
            type: EmployeeType,
            args: { id: { type: GraphQLID } },
            async resolve(_, args) {
                return await Employee.findById(args.id);
            }
        },
        searchEmployees: {
            type: new GraphQLList(EmployeeType),
            args: {
                designation: { type: GraphQLString },
                department: { type: GraphQLString }
            },
            async resolve(_, { designation, department }) {
                const query = {};

                if (designation) {
                    query.designation = designation;
                }

                if (department) {
                    query.department = department;
                }

                return await Employee.find(query);
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: AuthPayloadType,
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { username, email, password }) {
                const existingUser = await User.findOne({ 
                    $or: [
                        { username }, 
                        { email }
                    ] 
                });
                if (existingUser) {
                    throw new Error('User with this email or username already exists');
                }
            
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    username,
                    email,
                    password: hashedPassword
                });
            
                await newUser.save();
                const token = jwt.sign({ userId: newUser.id }, 'mysecretkey', { expiresIn: '1h' });
            
                return { user: newUser, token };
            }
        },
        addEmployee: {
            type: EmployeeType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString },
                gender: { type: GraphQLString },
                designation: { type: GraphQLString },
                salary: { type: GraphQLFloat },
                date_of_joining: { type: GraphQLString },
                department: { type: GraphQLString }
            },
            async resolve(_, args) {
                const employee = new Employee(args);
                return await employee.save();
            }
        },
        updateEmployee: {
            type: EmployeeType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString },
                gender: { type: GraphQLString },
                designation: { type: GraphQLString },
                salary: { type: GraphQLFloat },
                date_of_joining: { type: GraphQLString },
                department: { type: GraphQLString },
                employee_photo: { type: GraphQLString }
            },
            async resolve(_, args) {
                const { id, ...updateFields } = args;
                const employee = await Employee.findByIdAndUpdate(id, updateFields, { new: true });
                if (!employee) {
                    throw new Error('Employee not found');
                }

                return employee;
            }
        },
        deleteEmployee: {
            type: EmployeeType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { id }) {
                const employee = await Employee.findById(id);
                if (!employee) {
                    throw new Error('Employee not found');
                }
                await Employee.findByIdAndDelete(id);
                return employee;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
