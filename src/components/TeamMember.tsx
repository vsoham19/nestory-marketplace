
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  imageSrc: string;
  delay?: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, description, imageSrc, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
        <div className="h-80 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={`${name} - ${role}`}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-primary font-medium mb-4">{role}</p>
          <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
          
          <div className="flex space-x-3">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${name}'s LinkedIn profile`}
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${name}'s GitHub profile`}
            >
              <Github size={20} />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeamMember;
