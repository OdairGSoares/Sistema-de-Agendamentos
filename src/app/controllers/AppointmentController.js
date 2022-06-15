import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Notifications from '../schema/Notifications';

class AppointmentController {

  async index(req, res) {

    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: [ 'id', 'date' ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [{
        model: User,
        as: 'collaborator',
        attributes: [ 'id', 'name' ],
        include: [{
          model: File,
          as: 'photo',
          attributes: [ 'id', 'path', 'url' ],
        }],
      }],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    
    const schema = Yup.object().shape({
      collaborator_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: 'validation failure'
      });
    };

    const { collaborator_id, date } = req.body;

    const isCollaborator = await User.findOne({
      where: { 
        id: collaborator_id,
        provider: true, 
      }
    });

    if(!isCollaborator) {
      return res.status(401).json({
        error: 'This user is not a collaborator'
      });
    };

    const startingHour = startOfHour(parseISO(date));

    if(isBefore(startingHour, new Date())) {
      return res.status(401).json({
        error: 'schedule not available'
      });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        collaborator_id,
        canceled_at: null,
        date: startingHour,
      }
    });

    if(checkAvailability) {
      return res.status(401).json({
        error: 'schedule not available for this collaborator'
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      collaborator_id,
      date: startingHour,
    });

    const user = await User.findByPk(req.userId);
    const formatDate = format(
      startingHour,
      "'dia' dd 'de' MMMM', at' H:mm'h'",
      { locale: pt },
    );

    await Notifications.create({
      content: `New appointment from ${user.name} to ${formatDate}`,
      user: collaborator_id,
    })
    
    return res.json(appointment);
  }
}

export default new AppointmentController();