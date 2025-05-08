
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
import { getUserProperties, deleteProperty } from '@/services/propertyService';
import { Property } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

const Profile = () => {
  const { user, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

    // Load user properties
    if (user) {
      fetchUserProperties();
    }
  }, [user, isLoading, navigate]);

  const fetchUserProperties = async () => {
    setIsLoadingProperties(true);
    try {
      const userProperties = await getUserProperties();
      setProperties(userProperties);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      toast({
        title: "Error",
        description: "Failed to load your properties",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Update",
      description: "This feature will be implemented soon.",
    });
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteProperty(propertyId);
      
      if (result.success) {
        // Update the local state to remove the deleted property
        setProperties(properties.filter(prop => prop.id !== propertyId));
        
        toast({
          title: "Property Deleted",
          description: "Your property has been successfully deleted",
        });
      } else {
        throw new Error(result.error || "Failed to delete the property");
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast({
        title: "Error",
        description: "Failed to delete the property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
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
          
          {/* User Properties Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Properties</CardTitle>
              <CardDescription>Manage properties you've added</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProperties ? (
                <p>Loading your properties...</p>
              ) : properties.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>₹{property.price.toLocaleString()}</TableCell>
                        <TableCell>{property.published ? 'Published' : 'Draft'}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={isDeleting}>
                                <Trash2 className="mr-1 h-4 w-4" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your property "{property.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProperty(property.id)}
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't added any properties yet.</p>
                  <Button onClick={() => navigate('/add-property')}>Add Property</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
