import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  tags: string[];
  folder: string;
}

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Проектная документация.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadDate: '2024-07-28',
      tags: ['работа', 'документы'],
      folder: 'Документы'
    },
    {
      id: '2',
      name: 'Отпускные фото.zip',
      size: '45.8 MB',
      type: 'archive',
      uploadDate: '2024-07-25',
      tags: ['личное', 'фото'],
      folder: 'Медиа'
    },
    {
      id: '3',
      name: 'Бюджет на месяц.xlsx',
      size: '156 KB',
      type: 'spreadsheet',
      uploadDate: '2024-07-30',
      tags: ['финансы', 'планирование'],
      folder: 'Документы'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Все файлы');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now().toString() + index,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name),
      uploadDate: new Date().toISOString().split('T')[0],
      tags: ['новый'],
      folder: 'Общие'
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const typeMap: { [key: string]: string } = {
      'pdf': 'pdf',
      'doc': 'document',
      'docx': 'document',
      'txt': 'document',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'mp4': 'video',
      'avi': 'video',
      'mov': 'video',
      'zip': 'archive',
      'rar': 'archive',
      'xlsx': 'spreadsheet',
      'xls': 'spreadsheet'
    };
    return typeMap[extension || ''] || 'file';
  };

  const getFileIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'pdf': 'FileText',
      'document': 'FileText',
      'image': 'Image',
      'video': 'Video',
      'archive': 'Archive',
      'spreadsheet': 'Table',
      'file': 'File'
    };
    return iconMap[type] || 'File';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'Все файлы' || file.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const folders = ['Все файлы', ...Array.from(new Set(files.map(file => file.folder)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="Lock" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Личное Хранилище
                </h1>
                <p className="text-sm text-muted-foreground">Закрытый доступ</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-lg">
                <Icon name="Shield" size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">Приватно</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {files.length} файлов
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="FolderOpen" size={20} />
                  Папки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {folders.map(folder => (
                  <Button
                    key={folder}
                    variant={selectedFolder === folder ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <Icon name="Folder" size={16} className="mr-2" />
                    {folder}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Storage Stats */}
            <Card className="mt-6 bg-white/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="HardDrive" size={20} />
                  Хранилище
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Использовано</span>
                      <span>2.8 GB из 10 GB</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <Icon name="FileText" size={24} className="mx-auto mb-1 text-primary" />
                      <div className="font-medium">1.2 GB</div>
                      <div className="text-muted-foreground">Документы</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <Icon name="Image" size={24} className="mx-auto mb-1 text-secondary" />
                      <div className="font-medium">1.6 GB</div>
                      <div className="text-muted-foreground">Медиа</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Upload Area */}
            <Card 
              className={`mb-8 border-2 border-dashed transition-all duration-200 ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-border/50 bg-white/60 backdrop-blur-sm'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Upload" size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Загрузите файлы</h3>
                  <p className="text-muted-foreground mb-6">
                    Перетащите файлы сюда или нажмите для выбора
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Icon name="Plus" size={20} className="mr-2" />
                    Выбрать файлы
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search and Tabs */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск файлов и тегов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/60 backdrop-blur-sm border-border/50"
                  />
                </div>
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                  <Icon name="Filter" size={18} className="mr-2" />
                  Фильтры
                </Button>
              </div>

              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="bg-white/60 backdrop-blur-sm">
                  <TabsTrigger value="grid">
                    <Icon name="Grid3X3" size={16} className="mr-2" />
                    Сетка
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <Icon name="List" size={16} className="mr-2" />
                    Список
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="mt-6">
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFiles.map(file => (
                      <Card key={file.id} className="group hover:shadow-lg transition-all duration-200 bg-white/60 backdrop-blur-sm border-border/50 hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                              <Icon name={getFileIcon(file.type)} size={24} className="text-primary" />
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon name="MoreVertical" size={16} />
                            </Button>
                          </div>
                          
                          <h4 className="font-medium mb-2 line-clamp-2">{file.name}</h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Icon name="Calendar" size={14} />
                              {new Date(file.uploadDate).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="FileText" size={14} />
                              {file.size}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-4">
                            {file.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-accent/10 text-accent">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-border/50">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                        {filteredFiles.map(file => (
                          <div key={file.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                                <Icon name={getFileIcon(file.type)} size={20} className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">{file.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>{file.size}</span>
                                  <span>{new Date(file.uploadDate).toLocaleDateString('ru-RU')}</span>
                                  <div className="flex gap-1">
                                    {file.tags.map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-xs bg-accent/10 text-accent">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Icon name="MoreVertical" size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;