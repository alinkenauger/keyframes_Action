import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CategoryCreatorTemplate } from '@/lib/creatorTemplates';
import { getCategoryIcon } from '@/components/skeleton/CreateSkeletonDialog'; 

interface TemplateCardProps {
  template: CategoryCreatorTemplate;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <div 
      key={template.id} 
      className={cn(
        "relative border rounded-lg p-2 transition-all hover:shadow-sm",
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-start gap-2">
        <RadioGroupItem 
          value={template.id} 
          id={template.id} 
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <Label htmlFor={template.id} className="text-sm font-medium cursor-pointer truncate mr-1.5">
              {template.name}
            </Label>
            <div className="flex-shrink-0 flex items-center">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground">
                {getCategoryIcon(template.category)}
                <span className="ml-0.5 truncate max-w-[60px]">{template.category}</span>
              </span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {template.description}
          </p>
          
          <div className="mt-1.5 flex flex-wrap items-center text-[10px]">
            <span className="font-medium text-foreground/80 mr-1">{template.units.length} units:</span>
            <span className="text-muted-foreground truncate">{template.units.join(' → ')}</span>
          </div>
          
          {template.frames && template.frames[0]?.examples && template.frames[0].examples[0] && (
            <div className="mt-1.5 p-1.5 bg-muted/50 rounded-md text-[10px] text-muted-foreground border border-border/50">
              <span className="inline-block font-medium text-foreground/70 mr-1">Example:</span>
              <span className="line-clamp-2">"{template.frames[0].examples[0].content.substring(0, 75)}
              {template.frames[0].examples[0].content.length > 75 ? '...' : ''}"</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
