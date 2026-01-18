import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

export default function DemoPage() {
  return (
    <Container className="py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Buttons</h1>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold opacity-70">Solid (Plný)</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="solid" color="primary">
                Primary
              </Button>
              <Button variant="solid" color="secondary">
                Secondary
              </Button>
              <Button variant="solid" color="accent">
                Accent
              </Button>
              <Button variant="solid" color="destructive">
                Destructive
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold opacity-70">Outline</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" color="primary">
                Primary
              </Button>
              <Button variant="outline" color="secondary">
                Secondary
              </Button>
              <Button variant="outline" color="accent">
                Accent
              </Button>
              <Button variant="outline" color="destructive">
                Destructive
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold opacity-70">Ghost (Iba text)</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="ghost" color="primary">
                Primary
              </Button>
              <Button variant="ghost" color="secondary">
                Secondary
              </Button>
              <Button variant="ghost" color="accent">
                Accent
              </Button>
              <Button variant="ghost" color="destructive">
                Destructive
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold opacity-70">Sizes & States</h2>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Cards</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content goes here. Numbers should use Space Grotesk: 1234567890</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dialog</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>Dialog content...</p>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  )
}
