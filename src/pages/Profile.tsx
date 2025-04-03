
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }

    // Set initial values from user metadata
    if (user?.user_metadata) {
      setName(user.user_metadata.name || '');
      setPhone(user.user_metadata.phone || '');
    }
  }, [user, isLoading, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Update",
      description: "This feature will be implemented soon.",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-10 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback>{name.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
                <p className="text-sm mt-1">{phone}</p>
              </CardContent>
            </Card>

            {/* Edit Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
