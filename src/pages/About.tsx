
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import TeamMember from '@/components/TeamMember';
import { Card } from '@/components/ui/card';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <Layout>
      <div className="container-custom py-12 md:py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the talented team behind Estate Finder, dedicated to creating the best property search experience for our users.
          </p>
        </motion.div>

        {/* Our Mission */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg">
              At Estate Finder, we're on a mission to simplify the property search process. We believe finding your perfect home or investment property should be exciting and stress-free. Our platform combines cutting-edge technology with a user-friendly interface to help you discover, evaluate, and connect with properties that match your unique criteria.
            </p>
          </Card>
        </motion.div>

        {/* Team Section */}
        <div className="mb-16">
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Our Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamMember
              name="Krushil"
              role="System Architect"
              description="Krushil led the system design of Estate Finder, creating a robust and scalable architecture that powers our platform. His expertise in designing efficient systems ensures our website can handle thousands of property listings while maintaining optimal performance."
              imageSrc="/lovable-uploads/67e5abc8-909d-4e5b-9372-b16c2e968568.png"
              delay={0.4}
            />
            <TeamMember
              name="Soham"
              role="Backend Developer"
              description="Soham built the backend infrastructure using Supabase, developing the data dictionary and defining relationships between different entities. His work enables seamless data flow, secure authentication, and efficient property search capabilities."
              imageSrc="/lovable-uploads/405fa31d-982a-4295-83cd-d344aac9a73e.png"
              delay={0.5}
            />
            <TeamMember
              name="Isha"
              role="Frontend Developer"
              description="Isha crafted the beautiful and intuitive user interface of Estate Finder. Her focus on user experience and attention to detail created a responsive, accessible, and visually appealing website that makes property searching a delightful experience."
              imageSrc="/lovable-uploads/90c8a117-8067-46df-8fe6-00eaab3b58a8.png"
              delay={0.6}
            />
          </div>
        </div>

        {/* Our Values */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "We constantly explore new technologies and approaches to improve your property search experience."
              },
              {
                title: "Transparency",
                description: "We believe in providing clear, honest information about properties and the real estate market."
              },
              {
                title: "User-Centered Design",
                description: "Every feature we build starts with understanding the needs of our users."
              }
            ].map((value, index) => (
              <Card key={value.title} className="p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to find your dream property?</h2>
          <p className="mb-6 text-muted-foreground">
            Start your search today or contact us if you have any questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/properties" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
              Browse Properties
            </a>
            <a href="mailto:contact@estatefinder.com" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors">
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default About;
