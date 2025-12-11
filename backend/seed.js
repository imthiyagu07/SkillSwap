import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.model.js';
import Session from './models/Session.model.js';
import Review from './models/Review.model.js';

dotenv.config();

const users = [
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Full-stack developer with 5 years of experience. Love teaching React and Node.js!',
        location: { city: 'San Francisco', country: 'USA' },
        timezone: 'PST',
        skillsOffered: [
            { skillName: 'React', category: 'Programming & Development', proficiencyLevel: 'Expert', description: 'Building modern web apps with React hooks and Redux' },
            { skillName: 'Node.js', category: 'Programming & Development', proficiencyLevel: 'Advanced', description: 'Backend development with Express and MongoDB' },
            { skillName: 'JavaScript', category: 'Programming & Development', proficiencyLevel: 'Expert', description: 'ES6+, async/await, and modern JS patterns' }
        ],
        skillsWanted: [
            { skillName: 'Python', category: 'Programming & Development' },
            { skillName: 'Machine Learning', category: 'Programming & Development' }
        ]
    },
    {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        bio: 'Data scientist passionate about AI and machine learning. Happy to help with Python and ML!',
        location: { city: 'New York', country: 'USA' },
        timezone: 'EST',
        skillsOffered: [
            { skillName: 'Python', category: 'Programming & Development', proficiencyLevel: 'Expert', description: 'Data analysis, ML, and automation' },
            { skillName: 'Machine Learning', category: 'Programming & Development', proficiencyLevel: 'Advanced', description: 'TensorFlow, scikit-learn, and PyTorch' },
            { skillName: 'Data Analysis', category: 'Programming & Development', proficiencyLevel: 'Expert', description: 'Pandas, NumPy, and data visualization' }
        ],
        skillsWanted: [
            { skillName: 'React', category: 'Programming & Development' },
            { skillName: 'UI/UX Design', category: 'Design & Creative' }
        ]
    },
    {
        name: 'Carol Williams',
        email: 'carol@example.com',
        password: 'password123',
        bio: 'UI/UX designer with an eye for beautiful interfaces. Love Figma and Adobe XD!',
        location: { city: 'London', country: 'UK' },
        timezone: 'GMT',
        skillsOffered: [
            { skillName: 'UI/UX Design', category: 'Design & Creative', proficiencyLevel: 'Expert', description: 'User research, wireframing, and prototyping' },
            { skillName: 'Figma', category: 'Design & Creative', proficiencyLevel: 'Advanced', description: 'Design systems and component libraries' },
            { skillName: 'Adobe XD', category: 'Design & Creative', proficiencyLevel: 'Advanced', description: 'Interactive prototypes and animations' }
        ],
        skillsWanted: [
            { skillName: 'Frontend Development', category: 'Programming & Development' },
            { skillName: 'Animation', category: 'Design & Creative' }
        ]
    },
    {
        name: 'David Chen',
        email: 'david@example.com',
        password: 'password123',
        bio: 'Mobile app developer specializing in React Native. Also love teaching guitar!',
        location: { city: 'Toronto', country: 'Canada' },
        timezone: 'EST',
        skillsOffered: [
            { skillName: 'React Native', category: 'Programming & Development', proficiencyLevel: 'Expert', description: 'Cross-platform mobile development' },
            { skillName: 'Guitar', category: 'Music & Arts', proficiencyLevel: 'Advanced', description: 'Acoustic and electric guitar, music theory' },
            { skillName: 'TypeScript', category: 'Programming & Development', proficiencyLevel: 'Advanced', description: 'Type-safe JavaScript development' }
        ],
        skillsWanted: [
            { skillName: 'Swift', category: 'Programming & Development' },
            { skillName: 'Piano', category: 'Music & Arts' }
        ]
    },
    {
        name: 'Emma Davis',
        email: 'emma@example.com',
        password: 'password123',
        bio: 'Digital marketing expert and content creator. Can help with SEO, social media, and more!',
        location: { city: 'Sydney', country: 'Australia' },
        timezone: 'AEST',
        skillsOffered: [
            { skillName: 'Digital Marketing', category: 'Business & Marketing', proficiencyLevel: 'Expert', description: 'SEO, SEM, and social media marketing' },
            { skillName: 'Content Writing', category: 'Writing & Content', proficiencyLevel: 'Advanced', description: 'Blog posts, copywriting, and storytelling' },
            { skillName: 'Photography', category: 'Photography & Video', proficiencyLevel: 'Intermediate', description: 'Product and portrait photography' }
        ],
        skillsWanted: [
            { skillName: 'Video Editing', category: 'Photography & Video' },
            { skillName: 'Graphic Design', category: 'Design & Creative' }
        ]
    },
    {
        name: 'Frank Martinez',
        email: 'frank@example.com',
        password: 'password123',
        bio: 'Professional chef and cooking instructor. Love teaching Italian and French cuisine!',
        location: { city: 'Paris', country: 'France' },
        timezone: 'CET',
        skillsOffered: [
            { skillName: 'Italian Cooking', category: 'Cooking & Culinary', proficiencyLevel: 'Expert', description: 'Pasta, risotto, and traditional Italian dishes' },
            { skillName: 'French Cuisine', category: 'Cooking & Culinary', proficiencyLevel: 'Advanced', description: 'Classic French techniques and recipes' },
            { skillName: 'Baking', category: 'Cooking & Culinary', proficiencyLevel: 'Advanced', description: 'Bread, pastries, and desserts' }
        ],
        skillsWanted: [
            { skillName: 'Japanese Cooking', category: 'Cooking & Culinary' },
            { skillName: 'Food Photography', category: 'Photography & Video' }
        ]
    },
    {
        name: 'Grace Lee',
        email: 'grace@example.com',
        password: 'password123',
        bio: 'Yoga instructor and fitness enthusiast. Teaching mindfulness and healthy living!',
        location: { city: 'Los Angeles', country: 'USA' },
        timezone: 'PST',
        skillsOffered: [
            { skillName: 'Yoga', category: 'Sports & Fitness', proficiencyLevel: 'Expert', description: 'Hatha, Vinyasa, and meditation' },
            { skillName: 'Meditation', category: 'Sports & Fitness', proficiencyLevel: 'Advanced', description: 'Mindfulness and breathing techniques' },
            { skillName: 'Nutrition', category: 'Sports & Fitness', proficiencyLevel: 'Intermediate', description: 'Healthy eating and meal planning' }
        ],
        skillsWanted: [
            { skillName: 'Pilates', category: 'Sports & Fitness' },
            { skillName: 'Spanish', category: 'Languages' }
        ]
    },
    {
        name: 'Henry Wilson',
        email: 'henry@example.com',
        password: 'password123',
        bio: 'Language teacher fluent in 5 languages. Love helping people communicate globally!',
        location: { city: 'Berlin', country: 'Germany' },
        timezone: 'CET',
        skillsOffered: [
            { skillName: 'Spanish', category: 'Languages', proficiencyLevel: 'Expert', description: 'Conversational and business Spanish' },
            { skillName: 'German', category: 'Languages', proficiencyLevel: 'Expert', description: 'Native speaker, all levels' },
            { skillName: 'French', category: 'Languages', proficiencyLevel: 'Advanced', description: 'Intermediate to advanced French' }
        ],
        skillsWanted: [
            { skillName: 'Mandarin Chinese', category: 'Languages' },
            { skillName: 'Web Development', category: 'Programming & Development' }
        ]
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Session.deleteMany({});
        await Review.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Hash passwords and create users
        const createdUsers = [];
        for (const userData of users) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = await User.create({
                ...userData,
                password: hashedPassword
            });
            createdUsers.push(user);
            console.log(`✅ Created user: ${user.name}`);
        }

        // Create some sample sessions
        const sessions = [
            {
                requester: createdUsers[0]._id, // Alice
                recipient: createdUsers[1]._id, // Bob
                skill: 'Python',
                scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                duration: 60,
                description: 'Introduction to Python basics and data structures',
                status: 'accepted'
            },
            {
                requester: createdUsers[1]._id, // Bob
                recipient: createdUsers[2]._id, // Carol
                skill: 'UI/UX Design',
                scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                duration: 90,
                description: 'Learn Figma basics and design principles',
                status: 'pending'
            },
            {
                requester: createdUsers[3]._id, // David
                recipient: createdUsers[0]._id, // Alice
                skill: 'React',
                scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                duration: 120,
                description: 'Advanced React patterns and hooks',
                status: 'completed'
            }
        ];

        for (const sessionData of sessions) {
            const session = await Session.create(sessionData);
            console.log(`✅ Created session: ${session.skill}`);
        }

        // Create some sample reviews
        const reviews = [
            {
                reviewer: createdUsers[3]._id, // David
                reviewee: createdUsers[0]._id, // Alice
                session: (await Session.findOne({ skill: 'React' }))._id,
                rating: 5,
                comment: 'Alice is an amazing teacher! Her explanations are clear and she has great patience. Learned so much about React hooks!',
                skillTaught: 'React'
            },
            {
                reviewer: createdUsers[0]._id, // Alice
                reviewee: createdUsers[1]._id, // Bob
                session: (await Session.findOne({ skill: 'Python' }))._id,
                rating: 5,
                comment: 'Bob is incredibly knowledgeable about Python and ML. Great session, highly recommend!',
                skillTaught: 'Python'
            }
        ];

        for (const reviewData of reviews) {
            const review = await Review.create(reviewData);

            // Update user ratings
            const reviewee = await User.findById(reviewData.reviewee);
            const userReviews = await Review.find({ reviewee: reviewData.reviewee });
            const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;

            reviewee.rating = avgRating;
            reviewee.reviewCount = userReviews.length;
            await reviewee.save();

            console.log(`✅ Created review for ${reviewee.name}`);
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📧 Sample login credentials:');
        console.log('Email: alice@example.com | Password: password123');
        console.log('Email: bob@example.com | Password: password123');
        console.log('Email: carol@example.com | Password: password123');
        console.log('Email: david@example.com | Password: password123');
        console.log('Email: emma@example.com | Password: password123');
        console.log('Email: frank@example.com | Password: password123');
        console.log('Email: grace@example.com | Password: password123');
        console.log('Email: henry@example.com | Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
