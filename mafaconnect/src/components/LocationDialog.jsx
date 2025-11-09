import *"react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocations } from "@/hooks/useLocations";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function LocationDialog({ open, onOpenChange, location }: LocationDialogProps) {
  const { createLocation, updateLocation } = useLocations();
  const [formData, setFormData] = React.useState({
    name,
    address,
    phone,
    email,
    state,
    zone,
    location_type,
    capacity_sqft,
    active,
    manager_id,
  });

  const { data: managers } = useQuery({
    queryKey,
    queryFn) => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, profiles, full_name, email)")
        .in("role", ["admin", "manager"]);
      
      if (error) throw error;
      return data.map(r => r.profiles).filter(Boolean);
    },
  });

  React.useEffect(() => {
    if (location) {
      setFormData({
        name,
        address,
        phone,
        email,
        state,
        zone,
        location_type,
        capacity_sqft) || "",
        active: location.active ?? true,
        manager_id: location.manager_id || "",
      });
    } else {
      setFormData({
        name,
        address,
        phone,
        email,
        state,
        zone,
        location_type,
        capacity_sqft,
        active,
        manager_id,
      });
    }
  }, [location, open]);

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const zones = [
    "North Central", "North East", "North West", 
    "South East", "South South", "South West"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      capacity_sqft: formData.capacity_sqft ? Number(formData.capacity_sqft) : undefined,
      manager_id: formData.manager_id || null,
    };

    if (location) {
      updateLocation({ id, ...submitData });
    } else {
      createLocation(submitData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{location ? "Edit Location" : "New Location"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name)}
                placeholder="Main Store, Warehouse A, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="location_type">Location Type *</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) => setFormData({ ...formData, location_type)}
              >
                <SelectTrigger id="location_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="depot">Depot</SelectItem>
                  <SelectItem value="retail_store">Retail Store</SelectItem>
                  <SelectItem value="distribution_center">Distribution Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => setFormData({ ...formData, state)}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zone">Zone *</Label>
              <Select
                value={formData.zone}
                onValueChange={(value) => setFormData({ ...formData, zone)}
              >
                <SelectTrigger id="zone">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z} value={z}>{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address)}
              placeholder="123 Main St, City"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone)}
                placeholder="+234..."
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email)}
                placeholder="location@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="capacity">Capacity (sq ft)</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity_sqft}
              onChange={(e) => setFormData({ ...formData, capacity_sqft)}
              placeholder="Storage capacity in square feet"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active)}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="manager">Location Manager (Optional)</Label>
            <Select
              value={formData.manager_id}
              onValueChange={(value) => setFormData({ ...formData, manager_id)}
            >
              <SelectTrigger id="manager">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {managers?.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.full_name} ({manager.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{location ? "Update Location" : "Create Location"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
