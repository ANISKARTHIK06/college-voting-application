import React from 'react';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Calendar, Users } from 'lucide-react';

const ElectionCard = ({ election, onVote }) => {
    const { title, description, deadline, participants, type, status } = election;

    const statusVariants = {
        Active: 'success',
        Ended: 'error',
        Scheduled: 'primary'
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow border-t-4 border-t-primary-600">
            <CardHeader className="flex justify-between items-start mb-2">
                <Badge variant={statusVariants[status]}>{status}</Badge>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{type}</span>
            </CardHeader>

            <CardContent className="flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-6">{description}</p>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Closes: {deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-medium">{participants} Students Participated</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-4 mt-auto">
                <Button
                    className="w-full"
                    disabled={status === 'Ended'}
                    onClick={() => onVote(election)}
                >
                    {status === 'Active' ? 'Vote Now' : 'View Details'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ElectionCard;
