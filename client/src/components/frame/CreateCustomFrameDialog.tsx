import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FRAME_CATEGORIES } from '@/lib/frameLibrary';
import { nanoid } from 'nanoid';

const customFrameSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  example: z.string().min(1, "Example is required"),
  popularUse: z.string().min(1, "Popular use is required"),
});

type CustomFrameFormData = z.infer<typeof customFrameSchema>;

interface CreateCustomFrameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (frame: any) => void;
}

export default function CreateCustomFrameDialog({ 
  open, 
  onOpenChange,
  onSave 
}: CreateCustomFrameDialogProps) {
  const form = useForm<CustomFrameFormData>({
    resolver: zodResolver(customFrameSchema),
    defaultValues: {
      name: '',
      description: '',
      example: '',
      popularUse: '',
    },
  });

  const onSubmit = (data: CustomFrameFormData) => {
    const newFrame = {
      id: nanoid(),
      ...data,
      category: FRAME_CATEGORIES.CUSTOM,
      isCustom: true,
    };
    onSave(newFrame);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Custom Frame</DialogTitle>
          <DialogDescription>
            Create a new frame template to use in your video content planning
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Surprise Revelation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this frame does..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide an example of how this frame is used..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popularUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Popular Use</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Story transitions, plot twists" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Frame</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}